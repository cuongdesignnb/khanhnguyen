'use client'

import { useState } from 'react'
import { toast } from '@/lib/toast'

interface UseAdminMutationOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  successMessage?: string
}

export function useAdminMutation(
  mutationFn: (...args: any[]) => Promise<any>,
  options: UseAdminMutationOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (...args: any[]) => {
    setLoading(true)
    setError(null)
    try {
      const data = await mutationFn(...args)
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
      if (options.onSuccess) {
        options.onSuccess(data)
      }
      return data
    } catch (err: any) {
      console.error('Mutation error:', err)
      const message = err.message || 'Có lỗi xảy ra khi thực hiện thao tác.'
      setError(message)
      toast.error(message)
      if (options.onError) {
        options.onError(err)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    mutate,
    loading,
    error,
  }
}
