import { useState, useCallback, useEffect, useMemo } from 'react'

export function usePromiseCall<T>(
  callback: (...args: any[]) => Promise<T>,
  options?: {
    params?: any
    onCompleted?: (data: T) => void
    onFailed?: (error: any) => void
  }
): {
  refetch: (...args: any[]) => void
  result: T | null
  loading: boolean
  error: any
} {
  const [optionsConfig] = useState(options)
  const [returnValue, setReturnValue] = useState<T | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const callFn = useCallback(
    (...args) => {
      const { onFailed, onCompleted, params } = optionsConfig || {}
      const _args = args ? args : [params]
      return callback(..._args)
        .then(data => {
          if (data) {
            setReturnValue(data)
          }
          onCompleted?.(data)
          return data
        })
        .catch(err => {
          console.error(err)
          setError(err || 'error ocurred in useImmediatelyCall hook')
          onFailed?.(err)
          return err
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [callback, optionsConfig]
  )

  useEffect(() => {
    callFn()
  }, [callFn])
  return { result: returnValue, error, loading, refetch: callFn }
}
