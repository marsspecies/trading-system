import { useState, useCallback } from 'react'
import { Logger } from 'utils/loggerHelper'

export function useAsyncCall<C extends (...args: any[]) => any>(
  callback: C,
  options?: {
    onFailed?: (...args: any[]) => void
  }
): [
  C,
  {
    result: UnPromisify<C> | null
    loading: boolean
    error: any
  }
] {
  const [returnValue, setReturnValue] = useState<UnPromisify<C> | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const callFn = useCallback(
    (...args) => {
      setLoading(true)

      return callback(...args)
        .then((data: UnPromisify<C>) => {
          if (data) {
            setReturnValue(data)
          }

          return data
        })
        .catch((err: Error) => {
          Logger.logError(err)
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

  return [callFn as C, { result: returnValue, error, loading }]
}
