import { isDev } from './getEnv'

export const logOnDev = (...args: any[]) => {
  if (!isDev()) return
  console.log(...args)
}

export const logError = (...args: any[]) => {
  console.error('[ERROR]: ', ...args)
}

export const Logger = {
  logOnDev,
  logError,
  logErrorOnDev: (...args: any[]) => {
    logError(...args)
  },
}
