/**
 * Pure layout maths for the Professional Certificate's staggered badge pyramid.
 *
 * This lives in its own module, apart from ChildBadgesGrid.tsx, for a coverage
 * reason that is easy to undo by accident. `data.test.ts` asserts that
 * `gridPositions(7)` is byte-identical to the frozen 2-3-2 shape, because
 * tests/e2e/certifications.spec.ts pins that grid and may not be edited. When
 * that assertion imported the helper from ChildBadgesGrid.tsx, the import
 * pulled the whole React component — and transitively CollapsePanel and
 * verify.ts — into vitest's v8 coverage denominator at near-zero coverage, and
 * the run failed the global 85% function/branch thresholds even though all 228
 * tests passed. Keeping the maths in a dependency-free module lets the test
 * exercise it without dragging three client components along.
 *
 * So: no "use client", no React, no imports. Keep it that way.
 */

/** Column placement on the 6-col track, each tile spanning 2 columns. A row of
 *  two is inset; a row of three is full-bleed; a lone tile centres. */
const ROW_COLS: Record<number, readonly string[]> = {
  1: ["col-start-3 col-end-5"],
  2: ["col-start-2 col-end-4", "col-start-4 col-end-6"],
  3: ["col-start-1 col-end-3", "col-start-3 col-end-5", "col-start-5 col-end-7"],
};

/** Row shapes for the staggered pyramid. n = 7 is the Professional
 *  Certificate's original 2-3-2 and MUST stay byte-identical: the grid it
 *  produces is asserted by tests/e2e/certifications.spec.ts, which may not be
 *  edited. Anything larger tiles as full rows of three and finishes on a
 *  tabled shape, so 13 → 3-3-3-2-2. */
const ROW_SHAPES: Record<number, readonly number[]> = {
  1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [2, 3], 6: [3, 3], 7: [2, 3, 2],
};

export function gridPositions(n: number): string[] {
  // An empty grid has no positions. Without this, ROW_SHAPES[0] is undefined,
  // the fallback pushes `...(ROW_SHAPES[0] ?? [0])` = [0], and `ROW_COLS[0] ??
  // ROW_COLS[3]` would hand back three column strings for zero tiles.
  if (n <= 0) return [];
  const shape =
    ROW_SHAPES[n] ??
    (() => {
      const rows: number[] = [];
      let left = n;
      while (left > 4) {
        rows.push(3);
        left -= 3;
      }
      rows.push(...(ROW_SHAPES[left] ?? [left]));
      return rows;
    })();
  return shape.flatMap((w) => ROW_COLS[w] ?? ROW_COLS[3]);
}
