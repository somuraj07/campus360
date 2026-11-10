"use client";

import React from "react";

// Flat, theme-aware canvas. The old purple/coral gradient blobs were removed in the
// college redesign; surfaces now come from the design tokens in app/globals.css.
export function GlobalBackground() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1] bg-canvas" />;
}
