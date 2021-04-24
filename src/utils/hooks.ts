import { useState, useCallback } from 'react'

export function useAsyncCall<T>(
  callback: (...args: any[]) => Promise<T>,
  options?: {
    onFailed?: (...args: any[]) => void
  }
): [
  (...args: any[]) => Promise<T>,
  {
    result: T | null
    loading: boolean
    error: any
  }
] {
  const [returnValue, setReturnValue] = useState<T | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const callFn = useCallback(
    (...args) => {
      setLoading(true)
      return callback(...args)
        .then(data => {
          if (data) {
            setReturnValue(data)
          }
          return data
        })
        .catch(err => {
          console.error(err)
          setError(err || 'error ocurred in useAsyncCall hook')
          options?.onFailed?.(err)
          return err
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [callback, options]
  )
  return [callFn, { result: returnValue, error, loading }]
}
