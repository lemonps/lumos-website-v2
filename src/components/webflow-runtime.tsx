"use client";

import { useEffect, useRef } from "react";

type WebflowRuntimeProps = {
  scripts: string[];
};

export function WebflowRuntime({ scripts }: WebflowRuntimeProps) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }

    hasRunRef.current = true;

    for (const script of scripts) {
      try {
        new Function(script)();
      } catch (error) {
        console.error("Failed to run Webflow runtime script.", error);
      }
    }
  }, [scripts]);

  return null;
}
