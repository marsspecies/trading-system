import { useState, useCallback, useEffect, useMemo } from 'react'

import ApiReqeust from './ApiReqeust'

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

export function useFetch<T>(
  api: RequestInfo,
  config?: {
    params?: any
    method?: 'get' | 'post'
    onCompleted?: (data: T) => void
    onFailed?: (error: any) => void
  }
) {
  const [requestInfo] = useState(api)
  const [requestConfig] = useState(config)

  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const requestFn = useCallback(() => {
    const { params, method = 'get', onCompleted, onFailed } =
      requestConfig || {}
    ApiReqeust[method]<T>(requestInfo, params)
      .then(res => {
        setData(res)
        onCompleted?.(res)
      })
      .catch(err => {
        setError(err)
        onFailed?.(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [requestConfig, requestInfo])

  useEffect(() => {
    requestFn()
  }, [requestFn])

  const returnValue = useMemo(() => {
    return {
      loading,
      data,
      error,
      refetch: requestFn,
    }
  }, [data, error, loading, requestFn])

  return returnValue
}

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
