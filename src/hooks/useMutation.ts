import Api from 'api/ApiReqeust'

import { useLazyRequest } from './useLazyRequest'

export interface MutationConfig {
  withToken?: boolean
}
export function useMutation<Data>(
  api: RequestInfo,
  params?: {
    onCompleted?: (data: any) => void
    variables?: Record<string, unknown>
  }
) {
  const result = useLazyRequest<Data>(api, Api.post, params)

  return result
}
