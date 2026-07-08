'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from './use-debounce'

interface UseAdminListOptions<T, R> {
  fetcher: (params: any) => Promise<any>
  initialParams?: any
  fallbackData?: R[]
  mapItem?: (item: any) => R
}

export function useAdminList<T = any, R = any>({
  fetcher,
  initialParams = {},
  fallbackData = [],
  mapItem,
}: UseAdminListOptions<T, R>) {
  const [items, setItems] = useState<R[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const [params, setParamsState] = useState(() => ({
    page: 1,
    limit: 10,
    ...initialParams,
  }))

  const debouncedSearch = useDebounce(params.q || '', 300)

  const setParams = useCallback((newParams: any) => {
    setParamsState((prev: any) => {
      const merged = { ...prev, ...newParams }
      // Reset page to 1 if filter fields change (excluding page/limit itself)
      const hasFilterChange = Object.keys(newParams).some(
        (k) => k !== 'page' && k !== 'limit' && prev[k] !== newParams[k]
      )
      if (newParams.page === undefined && hasFilterChange) {
        merged.page = 1
      }
      return merged
    })
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = { ...params, q: debouncedSearch }
      const res = await fetcher(queryParams)

      let rawItems = []
      let totalCount = 0
      let tPages = 1

      if (res && typeof res === 'object') {
        if (Array.isArray(res)) {
          rawItems = res
          totalCount = res.length
          tPages = 1
        } else {
          rawItems = res.items || []
          totalCount = res.total ?? rawItems.length
          tPages = res.totalPages ?? 1
        }
      }

      const mapped = mapItem ? rawItems.map(mapItem) : rawItems
      setItems(mapped)
      setTotal(totalCount)
      setTotalPages(tPages)
      setUsingFallback(false)
    } catch (err: any) {
      console.warn('API fetch error, using fallback data:', err)
      setError(err.message || 'Lỗi kết nối máy chủ')
      if (fallbackData && fallbackData.length > 0) {
        setItems(fallbackData)
        setTotal(fallbackData.length)
        setTotalPages(Math.ceil(fallbackData.length / (params.limit || 10)))
        setUsingFallback(true)
      } else {
        setItems([])
        setTotal(0)
        setTotalPages(1)
      }
    } finally {
      setLoading(false)
    }
  }, [fetcher, params, debouncedSearch, mapItem, fallbackData])

  useEffect(() => {
    loadData()
  }, [loadData])

  const reload = useCallback(() => {
    loadData()
  }, [loadData])

  return {
    items,
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
    loading,
    error,
    params,
    setParams,
    reload,
    usingFallback,
  }
}
