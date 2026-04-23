"use client";

import { useState, useEffect } from "react";

export function BadgeCount() {
  const [count, setCount] = useState<string>("8+");

  useEffect(() => {
    fetch("/api/badges")
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (data && typeof data.count === "number") {
          setCount(data.count.toString());
        }
      })
      .catch(() => {});
  }, []);

  return <>{count}</>;
}
