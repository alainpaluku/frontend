// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react"
import { ApiError } from "@/api/client"

interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  enabled = true
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : (err?.message || "Erreur"))
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, enabled])

  useEffect(() => {
    execute()
  }, [execute])

  return { data, isLoading: enabled ? isLoading : false, error, refetch: execute }
}
