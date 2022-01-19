import { chance } from '../../../helperFunctions.js'

export const generateSlotiRow = (amount, laimesti) => {
  let obj = {}
  let arr = []
  while (amount-- > 0) {
    const key = chance(laimesti)
    arr.push(key)
    obj[key] = laimesti[key]
  }
  return { arr, obj }
}