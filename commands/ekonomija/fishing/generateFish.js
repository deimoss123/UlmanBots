import { itemList } from '../../../itemList.js'
import { chance, findItem } from '../../../helperFunctions.js'

export const fishingRodList = {
  makskere: {
    uses: 15,
    costToRepair: 200,
    timeMin: 3.50,
    timeMax: 4.00
  },
  divainamakskere: {
    uses: 80,
    costToRepair: 1000,
    timeMin: 2.50,
    timeMax: 3.00
  }
}

const itemPool = {
  small: {
    uses: 1,
    chance: '*',
    pool: {
      draudzinzivs: { chance: '*' },
      daundizvs: { chance: '*' },
      oditiscitrus: { chance: '*' },
      virve: { chance: '*' },
    },
  },
  medium: {
    uses: 2,
    chance: 0.5,
    pool: {
      dizdraudzinzivs: { chance: '*' },
      dizdaundizvs: { chance: '*' },
      latloto: { chance: 0.1 },
    },
  },
  large: {
    chance: 0.25,
    uses: 4,
    pool: {
      divainazivs: { chance: '*' },
      juridiskazivs: { chance: '*' },
      nazis: { chance: 0.2 },
      dizloto: { chance: 0.12 },
      whatsapp: { chance: 0.02 }
    },
  },
}

const testItems = () => {
  Object.keys(itemPool).map(type => {
    Object.keys(itemPool[type].pool).map(item => {
      const { nameNomVsk } = findItem(item)
      console.log(nameNomVsk)
    })
  })
}

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const testMargins = (uses, timeMin, timeMax) => {

  let totalTime = 0
  let totalLati = 0

  let minTime = 9999
  let maxTime = 0

  let minProfit = 9999
  let maxProfit = 0

  const iterations = 1000000

  for (let j = 0; j < iterations; j++) {
    let i = uses
    let total = 0
    let time = 0

    while (i >= 0) {
      const type = chance(itemPool)
      const fishedItem = chance(itemPool[type].pool)

      const { price } = findItem(fishedItem)

      const timeToFish = (Math.random() * (timeMax - timeMin)) + timeMin

      total += price
      time += timeToFish

      i -= itemPool[type].uses
    }

    totalTime += time
    totalLati += total

    if (time < minTime) minTime = time
    if (time > maxTime) maxTime = time
    if (total < minProfit) minProfit = total
    if (total > maxProfit) maxProfit = total
  }

  console.log(`${minProfit}-${maxProfit} lati, ${floorTwo(minTime)}-${floorTwo(maxTime)} stundas`)
  console.log(`Average lati: ${totalLati / iterations}, average time: ${floorTwo(totalTime / iterations)}h`)
}

export default (fishingRod, usesLeft) => {

  //testItems()

  let i = usesLeft ? usesLeft : fishingRodList[fishingRod].uses
  const { timeMin, timeMax } = fishingRodList[fishingRod]

  //testMargins(i, timeMin, timeMax)

  let fishResults = {}
  let prevFishTime = Date.now()

  while (i > 0) {
    const type = chance(itemPool)
    const fishedItem = chance(itemPool[type].pool)

    const timeToFishHours = (Math.random() * (timeMax - timeMin)) + timeMin
    const timeToFishMillis = Math.floor(timeToFishHours * 30000)//3600000)

    prevFishTime += timeToFishMillis
    const date = new Date(prevFishTime)

    i -= itemPool[type].uses

    if (i < 0) i = 0

    fishResults[`${prevFishTime}`] = {
      fishedItem,
      usesLeft: i,
      date: date.toLocaleString()
    }
  }

  //console.log(fishResults)
  return fishResults
}