"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { Doc } from "../../convex/_generated/dataModel";

export function useQueryWithLocalStorageCache<T extends Doc<any>>(
  key: string,
  queryFn: FunctionReference<"query">,
  ...queryArgs: any[]
): T[] | null {
  // 1. Fire off the real Convex query:
  const fresh = useQuery(queryFn, ...(queryArgs as any));

  // 2. Read from localStorage _once_, synchronously, on initial mount.
  //    This runs before the first render on the client, so `data` is never null-flash.
  const [data, setData] = useState<T[] | null>(() => {
    if (typeof window === "undefined") return [];
    try {
      const json = localStorage.getItem(key);
      return json ? (JSON.parse(json) as T[]) : [];
    } catch {
      return [];
    }
  });

  // 3. Whenever `fresh` comes in from the server, replace and re-cache.
  useEffect(() => {
    if (fresh === undefined || fresh === null) return;
    // if it’s actually different, update state + localStorage
    if (!data || !dataEqual(fresh, data)) {
      setData(fresh);
      try {
        localStorage.setItem(key, JSON.stringify(fresh));
      } catch {}
    }
  }, [fresh, key, data]);

  return data;
}

function dataEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]._id !== b[i]._id) return false;
  }
  return true;
}
