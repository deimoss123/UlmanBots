import { itemList } from './itemList.js'

export const latsOrLati = lati => {
  if (lati % 10 === 1 && lati % 100 !== 11) return 'lats'
  else return 'lati'
}

export const chance = obj => {

  // noapaļo līdz 0.01
  const randNum = (Math.floor(Math.random() * 100) / 100).toFixed(2)

  let result
  let resultKey
  let sumChance = 0

  let starredArr = []

  for (const key in obj) {
    if (obj[key].chance !== '*') {
      sumChance += obj[key].chance
      if (randNum <= sumChance) {
        result = key
        break
      }
    } else starredArr.push(key)
  }

  //console.log(starredArr, 'starredArr')

  if (!result) result = starredArr[Math.floor(Math.random() * starredArr.length)]

  return result
}

export const stringifyItems = arr => {

  let count = {}
  arr.map(num => {
    count[num] = count[num] ? count[num] + 1 : 1
  })

  let resultArr = []

  for (const key in count) {
    for (const keysdb in itemList) {
      for (const keydb in itemList[keysdb]) {
        if (keydb === key) {
          resultArr.push(
            `${count[key]} ${count[key] === 1
              ? itemList[keysdb][keydb].nameAkuVsk
              : itemList[keysdb][keydb].nameAkuDsk}`)
        }
      }
    }
  }

  // ieliek komatu pirms pēdējā itema
  if (resultArr.length > 1) {
    resultArr[resultArr.length - 1] = 'un ' + resultArr[resultArr.length - 1]
  }

  // pārtaisa jauno array par stringu ar komatiem
  let resultString = resultArr.join(', ')

  // noņem pēdējo komatu
  return resultString.replace(/,([^,]*)$/, '$1')
}


// šī funkcija pārveidu garumzīmes un mīkstinājumzīmes uz parastajiem burtiem
// š => s, ā => a, utt.

// šis kods pavisam noteikti nav nozagts no stackoverflow
// šī funkcija pavisam noteikti kādā brīdi crashos botu
export const latToEng = text => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const getUserId = (text) => {
  if (text.startsWith('<@') && text.endsWith('>')) {
    text = text.slice(2, -1)
    if (text.startsWith('!')) {
      text = text.slice(1)
    }
    return text
  } else return 0
}

