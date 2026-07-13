'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ApiResponse } from '@/types/api'
import type { MediaFileDto, MediaUploadItem } from '@/types/media'

const acceptedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'application/pdf',
])

function uploadRequest(
  item: MediaUploadItem,
  folderId: string | null,
  onProgress: (progress: number) => void,
  onProcessing: () => void,
  onXhr: (xhr: XMLHttpRequest) => void,
) {
  return new Promise<MediaFileDto>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    onXhr(xhr)
    xhr.open('POST', '/api/admin/media/upload')
    xhr.withCredentials = true
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.min(85, Math.round((event.loaded / event.total) * 85)))
    }
    xhr.upload.onload = onProcessing
    xhr.onerror = () => reject(new Error('Mất kết nối khi tải file lên.'))
    xhr.onabort = () => reject(new Error('Đã hủy tải file.'))
    xhr.onload = () => {
      let response: ApiResponse<MediaFileDto>
      try {
        response = JSON.parse(xhr.responseText) as ApiResponse<MediaFileDto>
      } catch {
        reject(new Error(`Máy chủ trả phản hồi không hợp lệ (${xhr.status}).`))
        return
      }
      if (xhr.status >= 200 && xhr.status < 300 && response.success) resolve(response.data)
      else reject(new Error(response.success ? `Tải file thất bại (${xhr.status}).` : response.error))
    }
    const formData = new FormData()
    formData.append('file', item.file)
    if (folderId) formData.append('folderId', folderId)
    xhr.send(formData)
  })
}

export function useMediaUpload({
  folderId = null,
  concurrency = 3,
  onUploaded,
}: {
  folderId?: string | null
  concurrency?: number
  onUploaded?: (media: MediaFileDto) => void
} = {}) {
  const [queue, setQueue] = useState<MediaUploadItem[]>([])
  const entries = useRef(new Map<string, MediaUploadItem>())
  const pending = useRef<string[]>([])
  const running = useRef(0)
  const requests = useRef(new Map<string, XMLHttpRequest>())
  const drainRef = useRef<() => void>(() => undefined)

  const update = useCallback((id: string, patch: Partial<MediaUploadItem>) => {
    const current = entries.current.get(id)
    if (!current) return
    const next = { ...current, ...patch }
    entries.current.set(id, next)
    setQueue((items) => items.map((item) => item.id === id ? next : item))
  }, [])

  const uploadOne = useCallback(async (id: string) => {
    const item = entries.current.get(id)
    if (!item || item.status !== 'queued') return
    running.current += 1
    update(id, { status: 'validating', progress: 5, error: null })
    try {
      update(id, { status: 'uploading', progress: 10 })
      const result = await uploadRequest(
        item,
        folderId,
        (progress) => update(id, { status: 'uploading', progress }),
        () => update(id, { status: 'processing', progress: 90 }),
        (xhr) => requests.current.set(id, xhr),
      )
      update(id, { status: 'success', progress: 100, result })
      onUploaded?.(result)
    } catch (uploadError) {
      const current = entries.current.get(id)
      if (current?.status !== 'cancelled') {
        update(id, {
          status: 'error',
          progress: 0,
          error: uploadError instanceof Error ? uploadError.message : 'Tải file thất bại.',
        })
      }
    } finally {
      requests.current.delete(id)
      running.current = Math.max(0, running.current - 1)
      queueMicrotask(() => drainRef.current())
    }
  }, [folderId, onUploaded, update])

  const drain = useCallback(() => {
    while (running.current < concurrency && pending.current.length) {
      const id = pending.current.shift()
      if (id) void uploadOne(id)
    }
  }, [concurrency, uploadOne])

  useEffect(() => {
    drainRef.current = drain
  }, [drain])

  const addFiles = useCallback((fileList: File[] | FileList) => {
    const files = Array.from(fileList).slice(0, 20)
    const maxMb = 20
    const newItems = files.map<MediaUploadItem>((file) => {
      const error = !acceptedMimeTypes.has(file.type)
        ? 'Định dạng file chưa được hỗ trợ.'
        : file.size > maxMb * 1024 * 1024
          ? `File vượt quá giới hạn ${maxMb} MB.`
          : null
      return {
        id: crypto.randomUUID(),
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        progress: 0,
        status: error ? 'error' : 'queued',
        error,
        result: null,
      }
    })
    for (const item of newItems) {
      entries.current.set(item.id, item)
      if (item.status === 'queued') pending.current.push(item.id)
    }
    setQueue((current) => [...current, ...newItems])
    queueMicrotask(() => drainRef.current())
  }, [])

  const retry = useCallback((id: string) => {
    const item = entries.current.get(id)
    if (!item || item.status !== 'error') return
    update(id, { status: 'queued', error: null, progress: 0 })
    pending.current.push(id)
    queueMicrotask(() => drainRef.current())
  }, [update])

  const cancel = useCallback((id: string) => {
    pending.current = pending.current.filter((pendingId) => pendingId !== id)
    update(id, { status: 'cancelled', error: null, progress: 0 })
    requests.current.get(id)?.abort()
  }, [update])

  const remove = useCallback((id: string) => {
    const item = entries.current.get(id)
    if (!item || item.status === 'uploading' || item.status === 'processing') return
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    entries.current.delete(id)
    pending.current = pending.current.filter((pendingId) => pendingId !== id)
    setQueue((current) => current.filter((queueItem) => queueItem.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    for (const item of entries.current.values()) {
      if (item.status === 'success' || item.status === 'cancelled') {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
        entries.current.delete(item.id)
      }
    }
    setQueue((current) => current.filter((item) => item.status !== 'success' && item.status !== 'cancelled'))
  }, [])

  useEffect(() => () => {
    for (const item of entries.current.values()) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    }
    for (const xhr of requests.current.values()) xhr.abort()
  }, [])

  const successCount = queue.filter((item) => item.status === 'success').length
  const errorCount = queue.filter((item) => item.status === 'error').length
  const active = queue.some((item) => ['queued', 'validating', 'uploading', 'processing'].includes(item.status))

  return {
    queue,
    addFiles,
    retry,
    cancel,
    remove,
    clearCompleted,
    successCount,
    errorCount,
    active,
  }
}
