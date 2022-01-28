import { itemList } from './itemList.js'
import { getEmoji } from './reakcijas/atbildes.js'

export const floorTwo = num => { return Math.floor(num * 100) / 100 }

// ieņem vērtību un pārvērš par latiem vai latu
export const latsOrLati = lati => {
  if (lati % 10 === 1 && lati % 100 !== 11) return 'lats'
  return 'lati'
}

// izvēlās no objekta randomā kādu lietu
// lietām var būt svars, svars nav ja ir '*"
export const chance = obj => {
  // noapaļo līdz 0.0001
  const randNum = Math.random()

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


// pārvērš arr ar itemiem par izlasāmu tekstu
export const stringifyItems = (items, config = 1) => {

  let resultArr = []

  // pārtaisa objektu par teksta stringu
  for (const key in items) {
    for (const keysdb in itemList) {
      for (const keydb in itemList[keysdb]) {
        if (keydb === key) {
          resultArr.push(
            `${items[key]} ${items[key] === 1
              ? config ? itemList[keysdb][keydb].nameAkuVsk : itemList[keysdb][keydb].nameNomVsk
              : config ? itemList[keysdb][keydb].nameAkuDsk : itemList[keysdb][keydb].nameNomDsk}`)
        }
      }
    }
  }

  // ieliek komatu pirms pēdējā itema
  if (resultArr.length > 1) {
    resultArr[resultArr.length - 1] = 'un ' + resultArr[resultArr.length - 1]
  }

  // pārtaisa jauno arr par stringu ar komatiem
  let resultString = resultArr.join(', ')

  // noņem pēdējo komatu
  return '`' + resultString.replace(/,([^,]*)$/, '$1') + '`'
}

export const stringifyItems2 = (items, config = 0) => {

  let resultArr = []

  // pārtaisa objektu par teksta stringu
  for (const key in items) {
    for (const keysdb in itemList) {
      for (const keydb in itemList[keysdb]) {
        if (keydb === key) {
          resultArr.push(
            `• ${items[key]} ${items[key] === 1
              ? config ? itemList[keysdb][keydb].nameAkuVsk : itemList[keysdb][keydb].nameNomVsk
              : config ? itemList[keysdb][keydb].nameAkuDsk : itemList[keysdb][keydb].nameNomDsk}`)
        }
      }
    }
  }

  // pārtaisa jauno arr par stringu
  return '```' + resultArr.join('\n') + '```'
}

export const stringifyItemsList = items => {
  let resultFields = []
  for (const key of Object.keys(items)) {
    const { nameNomVsk, price } = findItem(key)
    resultFields.push({
      name: `${getEmoji([`_${key}`])} ${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} x${items[key]}`,
      value: `Vērtība: **${price}** ${latsOrLati(price)}`,
      inline: true
    })
  }
  return resultFields
}

export const stringifyItemsList2 = items => {
  let resultStr = ''
  for (const key of Object.keys(items)) {
    const { nameNomVsk } = findItem(key)
    resultStr += `> ${getEmoji([`_${key}`])} ${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)} x${items[key]}\n`
  }
  return resultStr
}

export const stringifyOne = key => {
  const { nameNomVsk } = findItem(key)
  return `${getEmoji([`_${key}`])} ${nameNomVsk.charAt(0).toUpperCase() + nameNomVsk.slice(1)}`
}

// pārvērš laiku sekundēs uz tekstu
export const timeToText = (time, option = 0) => {

  if (time < 1000) time = 1000
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
export const getUserId = async (text, guild) => {
  if (!text.startsWith('<@') && !text.endsWith('>')) return 0

  text = text.slice(2, -1)
  if (text.startsWith('!')) text = text.slice(1)

  if (!await guild.members.cache.find(member => member.id === text)) return 0
  return text
}

export const findItem = name => {
  for (const category in itemList) {
    for (const item in itemList[category]) {
      if (item === name) return itemList[category][item]
    }
  }
}

export const findItemById = id => {
  for (const category in itemList) {
    for (const item in itemList[category]) {
      if (itemList[category][item].ids.includes(id)) {
        return { key: item, item: itemList[category][item] }
      }
    }
  }
}

export const getEmojis = msgText => {
  let obj = {}

  const arr = msgText.split('>')

  for (const emoji of arr) {
    const arr2 = emoji.substring(2).split(':')

    obj[arr2[0]] = arr2[1]
  }

  console.log(obj)
}

