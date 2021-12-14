import Api from 'api/ApiReqeust'

import { useLazyRequest } from './useLazyRequest'

export function useLazyQuery<Data>(
  api: RequestInfo,
  params?: {
    onCompleted?: (data: any) => void
    variables?: Record<string, unknown>
  }
) {
  const result = useLazyRequest<Data>(api, Api.get, params)

  return result
}
