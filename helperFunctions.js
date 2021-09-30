import { itemList } from './itemList.js'

// ieņem vērtību un pārvērš par latiem vai latu
export const latsOrLati = lati => {
  if (lati % 10 === 1 && lati % 100 !== 11) return 'lats'
  return 'lati'
}

// izvēlās no objekta randomā kādu lietu
// lietām var būt svars, svars nav ja ir '*"
export const chance = obj => {

  // noapaļo līdz 0.01
  const randNum = (Math.floor(Math.random() * 100) / 100).toFixed(2)

  let result
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

  if (!result) result = starredArr[Math.floor(Math.random() * starredArr.length)]

  return result
}


// pārvērš array ar itemiem par izlasāmu tekstu
export const stringifyItems = items => {

  let resultArr = []

  // pārtaisa objektu par teksta stringu
  for (const key in items) {
    for (const keysdb in itemList) {
      for (const keydb in itemList[keysdb]) {
        if (keydb === key) {
          resultArr.push(
            `${items[key]} ${items[key] === 1
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
  return '`' + resultString.replace(/,([^,]*)$/, '$1') + '`'
}

// pārvērš laiku sekundēs uz tekstu
export const timeToText = (time, option = 0) => {

  time = Math.floor(time / 1000)

  const h = Math.floor(time / 3600)
  const m = Math.floor(time % 3600 / 60)
  const s = Math.floor(time % 3600 % 60)

  let result = []

  // pārvērtīs uz formātu "stundas, minūtes, sekundes"
  if (!option) {
    if (h) result.push(`${h} ${h % 10 === 1 && h % 100 !== 11 ? 'stunda' : 'stundas'}`)
    if (m) result.push(`${m} ${m % 10 === 1 && m % 100 !== 11 ? 'minūte' : 'minūtes'}`)
    if (s) result.push(`${s} ${s % 10 === 1 && s % 100 !== 11 ? 'sekunde' : 'sekundes'}`)
  }

  // pārvērtīs uz formātu "stundām, minūtēm, sekundēm"
  if (option === 1) {
    if (h) result.push(`${h} ${h % 10 === 1 && h % 100 !== 11 ? 'stundas' : 'stundām'}`)
    if (m) result.push(`${m} ${m % 10 === 1 && m % 100 !== 11 ? 'minūtes' : 'minūtēm'}`)
    if (s) result.push(`${s} ${s % 10 === 1 && s % 100 !== 11 ? 'sekundes' : 'sekundēm'}`)
  }
  
  // pārvērtīs uz formātu "stundu, minūti, sekundi"
  if (option === 2) {
    if (h) result.push(`${h} ${h % 10 === 1 && h % 100 !== 11 ? 'stundu' : 'stundas'}`)
    if (m) result.push(`${m} ${m % 10 === 1 && m % 100 !== 11 ? 'minūti' : 'minūtes'}`)
    if (s) result.push(`${s} ${s % 10 === 1 && s % 100 !== 11 ? 'sekundi' : 'sekundes'}`)
  }

  if (result.length > 1) {
    result[result.length - 1] = 'un ' + result[result.length - 1]
  }

  let str = result.join(', ')

  return str.replace(/,([^,]*)$/, '$1')

}


// šī funkcija pārveidu garumzīmes un mīkstinājumzīmes uz parastajiem burtiem
// š => s, ā => a, utt.

// šis kods pavisam noteikti nav nozagts no stackoverflow
// šī funkcija pavisam noteikti kādā brīdi crashos botu
export const latToEng = text => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// iegūst lietotāja ID no discord sintakses
export const getUserId = (text) => {
  if (text.startsWith('<@') && text.endsWith('>')) {
    text = text.slice(2, -1)
    if (text.startsWith('!')) {
      text = text.slice(1)
    }
    return text
  } else return 0
}

