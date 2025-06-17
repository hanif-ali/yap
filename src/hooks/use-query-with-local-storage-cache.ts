import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { FunctionReference } from "convex/server";

/**
 * A client-side hook that uses Convex's useQuery with a localStorage cache,
 * while avoiding hydration mismatches by only reading localStorage after mount.
 */
export function useQueryWithLocalStorageCache<T>(
  key: string,
  queryFn: FunctionReference<"query">,
  ...queryArgs: any[]
): T | null {
  const [data, setDataState] = useState<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const json = localStorage.getItem(key);
      if (json) {
        setDataState(JSON.parse(json) as T);
      }
    } catch {
    }
  }, [key]);

  const fresh = useQuery(queryFn, ...(queryArgs as any));

  useEffect(() => {
    if (fresh !== undefined) {
      setDataState(fresh);
      try {
        localStorage.setItem(key, JSON.stringify(fresh));
      } catch {
      }
    }
  }, [fresh, key]);

  return data;
}
