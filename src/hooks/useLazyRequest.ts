import { useState, useCallback, useRef, useEffect } from 'react'

export function useLazyRequest<Data>(
  api: RequestInfo,
  requestApi: (...args: any) => Promise<Data>,
  params?: {
    onCompleted?: (data: any) => void
    variables?: Record<string, unknown>
  }
): [
  (data?: any) => Promise<Data>,
  { loading: boolean; data: any; error: Error | null }
] {
  const cacheArgs = useRef({
    api,
    fetcher: requestApi,
    params,
  })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Data>()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    cacheArgs.current = {
      api,
      fetcher: requestApi,
      params,
    }
  }, [api, params, requestApi])

  const requestFunc = useCallback((data?: any) => {
    setLoading(true)

    const { api, fetcher, params } = cacheArgs.current

    return fetcher(api, data || params?.variables)
      .then(response => {
        setData(response)
        params?.onCompleted?.(response)

        return response
      })
      .catch(err => {
        setError(err)
        params?.onCompleted?.(err)

        return err
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return [requestFunc, { loading, data, error }]
}
