export const getTodayStartTime = () => {
  const date = new Date()
  return new Date(
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  ).getTime()
}
