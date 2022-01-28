export const blackColors = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
]

export const generateNum = () => {
  const num = Math.floor(Math.random() * 37)
  let color = 'r'
  if (blackColors.includes(num)) color = 'b'
  if (num === 0) color = 'g'

  return { num, color }
}

export const checkWin = (pos, num, color) => {
  if (['b','r'].includes(pos)) {
    if (pos === color) return 2
    return 0
  }

  if (['odd', 'even'].includes(pos)) {
    if (pos === 'even' && num % 2 === 0) return 2
    if (pos === 'odd' && num % 2 !== 0) return 2
    return 0
  }

  if (['low', 'high'].includes(pos)) {
    if (pos === 'low' && num >= 1 && num <= 18) return 2
    if (pos === 'high' && num >= 19 && num <= 36) return 2
    return 0
  }

  if (!isNaN(pos)) {
    if (pos == num) return 35
    return 0
  }
}