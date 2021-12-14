import { Logger } from '../loggerHelper'

export const getLocalJsonField = (fieldName: string) => {
  const value = localStorage.getItem(fieldName)
  let item: any = null
  if (value) {
    try {
      item = JSON.parse(value)
    } catch (error) {
      Logger.logError(`invalid value of ${fieldName}`)
    }
  }
  return item
}
