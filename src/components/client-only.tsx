"use client";

import { useState, useEffect, ReactNode } from "react";

// hacky way to get around localStorage not being available on the server
export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
}
