import { buttonEmbed, embedError, embedTemplate, noPing } from '../../embeds/embeds.js'
import {
  addItems,
  addLati, addStatus,
  findUser,
  removeOneDateCooldown,
  setDateCooldown,
} from '../../ekonomija.js'
import {
  chance, findItem,
  floorTwo,
  stringifyItemsList2,
  stringifyOne,
  timeToText,
} from '../../helperFunctions.js'
import { itemList } from '../../itemList.js'
import { emojiList, getEmoji } from '../../reakcijas/atbildes.js'

const calcAtrk = () => {
  let res = {}
  for (let i = 0; i < 3; i++) {
    const atkr = chance(itemList.atkritumi)
    res[atkr] = res[atkr] ? res[atkr] + 1 : 1
  }
  return res
}

const calcSteal = () => {
  const pool = {
    'vakcinets': { chance: '*' },
    virve: { chance: 0.05 },
    latloto: { chance: 0.1 },
    zemenurasens: { chance: 0.075 },
    makskere: { chance: 0.05 }
  }
  return chance(pool)
}

const calcSellCitrus = () => {
  const min = 10
  const max = 20
  return floorTwo(Math.random() * (max - min) + min)
}

const makeDefaultRow = (rand, items) => {
  let row = [{
    type: 1,
    components: [{
      type: 2,
      label: 'Meklēt atkritumus',
      style: 1,
      custom_id: `atrk ${rand}`
    }, {
      type: 2,
      label: 'Apzagt veikalu',
      style: 1,
      custom_id: `apzagt ${rand}`
    }]
  }]

  if (items.oditiscitrus > 0) {
    row[0].components.push({
      type: 2,
      label: 'Tirgot odekolonu "Citrus"',
      style: 1,
      custom_id: `tirgot citrus ${rand}`,
      emoji: {
        name: '_oditiscitrus',
        id: emojiList._oditiscitrus
      }
    })
  }

  return row
}

const makeLimitRow = (rand) => {
  return [{
    type: 1,
    components: [{
      type: 2,
      label: 'Izdzert odekolonu "Citrus"',
      style: 1,
      custom_id: `izdzert citrus ${rand}`,
      emoji: {
        name: '_oditiscitrus',
        id: emojiList._oditiscitrus
      }
    }]
  }]
}

const calculateBomzot = times => {
  const totalTimes = times

  let totalLati = 0

  while (--times >= 0) {
    const res = calcAtrk()

    for (const item of Object.keys(res)) {
      const { price } = findItem(item)
      totalLati += price * res[item]
    }
  }

  console.log(totalLati/totalTimes)
}

export default {
  title: 'Bomžot',
  description: 'Bomžot un ielām',
  commands: ['bomzot', 'bomzis'],
  cooldown: 300000,
  uses: 5,
  extraUses: 3,
  callback: async message => {
    const { guildId } = message
    const userId = message.author.id

    //calculateBomzot(1000000)

    let { itemCount, itemCap, items, dateCooldowns } = await findUser(guildId, userId)

    const rand = Math.floor(Math.random() * 100000)
    let description = 'Kā tu vēlies bomžot?'
    let row = makeDefaultRow(rand, items)

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(noPing(
        `Lai bomžotu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }

    if (dateCooldowns['Bomžot'].extraUses < 1) {
      message.reply(noPing('Tu šodien vairs nevari bomžot'))
      return 2
    }

    if (dateCooldowns['Bomžot'].uses < 1) {
      if (!items.oditiscitrus) {
        message.reply(noPing(
          `Lai bomžotu velreiz tev ir nepieciešams ${getEmoji(['_oditiscitrus'])} **odekolons "Citrus"**`))
        return 2
      }
      description = `Lai bomžotu velreiz izdzer ${getEmoji(['_oditiscitrus'])} **odekolonu "Citrus"**`
      row = makeLimitRow(rand)
    }

    await buttonEmbed({
      message,
      title: `Bomžot (${dateCooldowns['Bomžot'].uses}/5) (${dateCooldowns['Bomžot'].extraUses}/3)`,
      commandTitle: 'Bomžot',
      description,
      time: 30000,
      row,
      color: 0x823a0a,
      cb: async i => {
        // Izdzert odekolonu lai bomžotu velreiz
        if (i.customId === `izdzert citrus ${rand}`) {
          await addItems(guildId, userId, { oditiscitrus: -1 })
          return {
            id: `izdzert citrus ${rand}`,
            edit: 'Kā tu vēlies bomžot?',
            editComponents: makeDefaultRow(rand, items)
          }
        } else if (i.customId.includes(`${rand}`)) {
          let returnObj = {}

          // Bomžot
          if (i.customId === `atrk ${rand}`) {
            const foundItems = calcAtrk()
            await addItems(guildId, userId, foundItems)
            returnObj = {
              edit: 'Izvēle: `Meklēt atkritumus`',
              editFields: [
                {
                  name: 'Atkritumos tu atradi:',
                  value: stringifyItemsList2(foundItems)
                }
              ]
            }
          }

          if (i.customId === `apzagt ${rand}`) {
            const itemStolen = calcSteal()

            let editFields = []

            if (itemStolen !== 'vakcinets') {
              let obj = {}
              obj[itemStolen] = 1
              await addItems(guildId, userId, obj)

              editFields = [
                {
                  name: 'No veikala tu nozagi:',
                  value: stringifyOne(itemStolen)
                }
              ]
            } else {
              await addStatus(guildId, userId, { vakcinets: 3600000 })
              const { status } = await findUser(guildId, userId)

              editFields = [
                {
                  name: 'Apzogot veikalu tu uzkāpi uz vakcīnas',
                  value: `Tu tagad esi vakcinēts \`${timeToText(status.vakcinets - Date.now())}\``
                }
              ]
            }

            returnObj = {
              edit: 'Izvēle: `Apzagt veikalu`',
              editFields
            }
          }

          if (i.customId === `tirgot citrus ${rand}`) {
            const profit = calcSellCitrus()

            await addItems(guildId, userId, { oditiscitrus: -1 })
            await addLati(guildId, userId, profit)
            returnObj = {
              edit: 'Izvēle: `Tirgot odekolonu "Citrus"`',
              editFields: [
                {
                  name: 'Tu pārdevi odekolonu par',
                  value: `${profit} latiem`
                }
              ]
            }
          }

          await removeOneDateCooldown(guildId, userId, 'Bomžot')
          const { dateCooldowns } = await findUser(guildId, userId)
          const { uses, extraUses } = dateCooldowns['Bomžot']

          return {
            ...returnObj,
            id: i.customId,
            editTitle: `Bomžot (${uses}/5) (${extraUses}/3)`,
            editComponents: [],
            deactivate: true,
          }
        }
      }
    })

    return 1
  }
}