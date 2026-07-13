'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { adminApi } from '@/lib/admin-api'
import { useDebounce } from './use-debounce'
import type {
  MediaFileDto,
  MediaFolderDto,
  MediaListQuery,
  MediaListResponse,
} from '@/types/media'

const defaultQuery: MediaListQuery = {
  page: 1,
  limit: 30,
  q: '',
  folderId: '',
  type: 'IMAGE',
  format: '',
  usage: '',
  sort: 'newest',
}

export function useMediaLibrary(initial: Partial<MediaListQuery> = {}) {
  const [query, setQueryState] = useState<MediaListQuery>({ ...defaultQuery, ...initial })
  const [items, setItems] = useState<MediaFileDto[]>([])
  const [folders, setFolders] = useState<MediaFolderDto[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedSearch = useDebounce(query.q, 350)
  const requestId = useRef(0)
  const { limit, folderId, type, format, usage, sort } = query

  const setQuery = useCallback((patch: Partial<MediaListQuery>) => {
    setQueryState((current) => ({ ...current, ...patch, page: patch.page ?? 1 }))
  }, [])

  const fetchPage = useCallback(async (page: number, append = false) => {
    const currentRequest = ++requestId.current
    if (append) setLoadingMore(true)
    else setLoading(true)
    setError(null)
    try {
      const response: MediaListResponse = await adminApi.getMediaList({
        limit,
        folderId,
        type,
        format,
        usage,
        sort,
        q: debouncedSearch,
        page,
      })
      if (currentRequest !== requestId.current) return
      setItems((current) => append
        ? [...current, ...response.items.filter((item) => !current.some((existing) => existing.id === item.id))]
        : response.items)
      setMeta({ total: response.total, page: response.page, totalPages: response.totalPages })
    } catch (fetchError) {
      if (currentRequest !== requestId.current) return
      setError(fetchError instanceof Error ? fetchError.message : 'Không thể tải Media Library.')
      if (!append) setItems([])
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [debouncedSearch, folderId, format, limit, sort, type, usage])

  const loadFolders = useCallback(async () => {
    try {
      setFolders(await adminApi.getMediaFolders())
    } catch (folderError) {
      setError(folderError instanceof Error ? folderError.message : 'Không thể tải thư mục Media.')
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPage(1), 0)
    return () => window.clearTimeout(timer)
  }, [fetchPage])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadFolders(), 0)
    return () => window.clearTimeout(timer)
  }, [loadFolders])

  const reload = useCallback(async () => {
    await Promise.all([fetchPage(1), loadFolders()])
  }, [fetchPage, loadFolders])

  const loadMore = useCallback(async () => {
    if (loadingMore || meta.page >= meta.totalPages) return
    await fetchPage(meta.page + 1, true)
  }, [fetchPage, loadingMore, meta.page, meta.totalPages])

  const addUploaded = useCallback((uploaded: MediaFileDto[]) => {
    setItems((current) => [
      ...uploaded,
      ...current.filter((item) => !uploaded.some((newItem) => newItem.id === item.id)),
    ])
    setMeta((current) => ({ ...current, total: current.total + uploaded.length }))
  }, [])

  const updateItem = useCallback((updated: MediaFileDto) => {
    setItems((current) => current.map((item) => item.id === updated.id ? updated : item))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setMeta((current) => ({ ...current, total: Math.max(0, current.total - 1) }))
  }, [])

  return {
    query,
    setQuery,
    items,
    folders,
    meta,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
    loadFolders,
    addUploaded,
    updateItem,
    removeItem,
  }
}
