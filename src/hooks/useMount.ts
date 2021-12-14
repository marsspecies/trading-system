import { useEffect } from 'react'

import { usePersistFn } from './usePersistFn'

export const useMount = (fn: () => void) => {
  const callFn = usePersistFn(fn)

  useEffect(() => {
    callFn()
  }, [callFn])
}
