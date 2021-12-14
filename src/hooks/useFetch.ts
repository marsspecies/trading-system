import { useState, useEffect, useCallback, useMemo } from 'react'
import ApiReqeust from 'api/ApiReqeust'

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
