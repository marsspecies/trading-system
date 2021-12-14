import { useFetch } from './useFetch'

export interface QueryConfig {
  onFailed?: (error: any) => void
  onCompleted?: (data: any) => void
  variables?: Record<string, unknown>
}
export function useQuery<Data>(key: RequestInfo, config?: QueryConfig) {
  const result = useFetch<Data>(key, {
    params: config?.variables,
    method: 'get',
    onCompleted: config?.onCompleted,
    onFailed: config?.onFailed,
  })

  return result
}
