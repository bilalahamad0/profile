#!/usr/bin/env python3
import sqlite3
import os
import re
import json
from os.path import expanduser, join, exists

CONV_DIR = expanduser("~/.gemini/antigravity/conversations")

def parse_proto(b):
    fields = {}
    i = 0
    n = len(b)
    while i < n:
        val = 0
        shift = 0
        while i < n:
            byte = b[i]
            i += 1
            val |= (byte & 0x7F) << shift
            shift += 7
            if not (byte & 0x80): break
        field_num = val >> 3
        wire_type = val & 7
        if wire_type == 0:
            v = 0
            shift = 0
            while i < n:
                byte = b[i]
                i += 1
                v |= (byte & 0x7F) << shift
                shift += 7
                if not (byte & 0x80): break
            fields.setdefault(field_num, []).append(v)
        elif wire_type == 2:
            length = 0
            shift = 0
            while i < n:
                byte = b[i]
                i += 1
                length |= (byte & 0x7F) << shift
                shift += 7
                if not (byte & 0x80): break
            data = b[i:i+length]
            i += length
            fields.setdefault(field_num, []).append(data)
        elif wire_type == 1:
            i += 8
        elif wire_type == 5:
            i += 4
        else:
            break
    return fields

def measure_all():
    if not exists(CONV_DIR):
        return {}

    project_totals = {}
    for f in sorted(os.listdir(CONV_DIR)):
        if not f.endswith(".db"): continue
        db = join(CONV_DIR, f)
        try:
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [r[0] for r in cur.fetchall()]
        except Exception:
            continue
        
        workspace = None
        if "trajectory_metadata_blob" in tables:
            try:
                cur.execute("SELECT data FROM trajectory_metadata_blob")
                row = cur.fetchone()
                if row and row[0]:
                    matches = re.findall(rb"/Users/[a-zA-Z0-9_\-\./]+", row[0])
                    for m in matches:
                        m_str = m.decode("utf-8", "ignore")
                        for proj in ["profile", "warn", "adhan-api", "adhan-ce", "adhan", "tmo"]:
                            if proj in m_str:
                                workspace = proj
                                break
                        if workspace: break
            except Exception:
                pass

        if not workspace and "steps" in tables:
            try:
                cur.execute("SELECT metadata FROM steps WHERE metadata IS NOT NULL LIMIT 10")
                for (sm,) in cur.fetchall():
                    matches = re.findall(rb"/Users/[a-zA-Z0-9_\-\./]+", sm)
                    for m in matches:
                        m_str = m.decode("utf-8", "ignore")
                        for proj in ["profile", "warn", "adhan-api", "adhan-ce", "adhan", "tmo"]:
                            if proj in m_str:
                                workspace = proj
                                break
                        if workspace: break
                    if workspace: break
            except Exception:
                pass

        if not workspace:
            continue

        if "profile" in workspace:
            proj_id = "profile"
        elif "adhan-ce" in workspace:
            proj_id = "adhan-ce"
        elif "adhan" in workspace:
            proj_id = "adhan"
        elif "warn" in workspace:
            proj_id = "warn"
        elif "tmo" in workspace:
            proj_id = "tmo"
        else:
            proj_id = workspace

        total_input = 0
        total_cached = 0
        total_output = 0
        total_calls = 0
        models = set()

        if "gen_metadata" in tables:
            try:
                cur.execute("SELECT idx, data FROM gen_metadata")
                for idx, data in cur.fetchall():
                    p = parse_proto(data)
                    if 1 in p:
                        p1 = parse_proto(p[1][0])
                        if 19 in p1:
                            m_name = p1[19][0].decode("utf-8", "ignore")
                            if m_name and m_name != "<synthetic>":
                                models.add(m_name)
                        if 4 in p1:
                            p4 = parse_proto(p1[4][0])
                            inp = p4.get(2, [0])[0]
                            out = p4.get(3, [0])[0]
                            cached = p4.get(5, [0])[0]
                            total_input += inp
                            total_output += out
                            total_cached += cached
                            total_calls += 1
            except Exception:
                pass

        total_tokens = total_input + total_cached + total_output
        stats = project_totals.setdefault(proj_id, {
            "calls": 0, "input": 0, "cached": 0, "output": 0, "total": 0, "models": set(), "convs": 0
        })
        stats["calls"] += total_calls
        stats["input"] += total_input
        stats["cached"] += total_cached
        stats["output"] += total_output
        stats["total"] += total_tokens
        stats["models"].update(models)
        stats["convs"] += 1

    for pid in project_totals:
        project_totals[pid]["models"] = sorted(list(project_totals[pid]["models"]))

    return project_totals

if __name__ == "__main__":
    res = measure_all()
    print(json.dumps(res, indent=2))
