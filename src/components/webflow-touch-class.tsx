"use client";

import { useEffect } from "react";

export function WebflowTouchClass() {
  useEffect(() => {
    const root = document.documentElement;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      return;
    }

    root.classList.add("w-mod-touch");

    return () => {
      root.classList.remove("w-mod-touch");
    };
  }, []);

  return null;
}
