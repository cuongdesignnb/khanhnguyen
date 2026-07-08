'use client'

import { useCallback, useEffect, useState } from 'react'

interface UseAdminDetailOptions<T> {
  id: string | null | undefined
  fetcher: (id: string) => Promise<T>
  enabled?: boolean
  fallbackData?: T | null
}

export function useAdminDetail<T = any>({
  id,
  fetcher,
  enabled = true,
  fallbackData = null,
}: UseAdminDetailOptions<T>) {
  const [data, setData] = useState<T | null>(fallbackData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!id || !enabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher(id)
      setData(res)
    } catch (err: any) {
      console.warn('API detail fetch error, using fallback:', err)
      setError(err.message || 'Lỗi kết nối máy chủ')
      if (fallbackData) {
        setData(fallbackData)
      }
    } finally {
      setLoading(false)
    }
  }, [id, fetcher, enabled, fallbackData])

  useEffect(() => {
    loadData()
  }, [loadData])

  const reload = useCallback(() => {
    loadData()
  }, [loadData])

  return {
    data,
    setData,
    loading,
    error,
    reload,
  }
}
