"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch, apiFetchPaginated, ApiError } from "@/lib/api";
import type { PaginationMeta } from "@/lib/types";

export function useData<T>(path: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);
    let cancelled = false;
    apiFetch<T>(path)
      .then((result) => {
        if (!cancelled && mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled && mountedRef.current) {
          setError(err instanceof ApiError ? err.message : "Failed to load");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, loading, error, reload };
}

export function useDataPaginated<T>(path: string, deps: unknown[] = []) {
  const [items, setItems] = useState<T>([] as T);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);
    let cancelled = false;
    apiFetchPaginated<T>(path)
      .then((result) => {
        if (!cancelled && mountedRef.current) {
          setItems(result.items);
          setMeta(result.meta);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled && mountedRef.current) {
          setError(err instanceof ApiError ? err.message : "Failed to load");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, reloadKey, ...deps]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { items, meta, loading, error, reload };
}

