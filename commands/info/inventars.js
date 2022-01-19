import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { buttonEmbed, embedSaraksts } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import pardot from '../ekonomija/pardot.js'
import izmantot from '../ekonomija/izmantot.js'
import { emojiList, getEmoji } from '../../reakcijas/atbildes.js'
import profileSchema from '../../schemas/profile-schema.js'
import mongo from '../../mongo.js'
import { okddId } from '../../index.js'

export const calcInvValue = items => {
  let invValue = 0

  if (items) if (Object.keys(items).length) {
    Object.keys(items).map(invItem => {
      if (invItem) {
        Object.keys(itemList).map(category => {
          if (itemList[category][invItem]) {
            invValue += itemList[category][invItem].price * items[invItem]
          }
        })
      }
    })
  }

  return invValue
}

const mapItems = (items) => {
  return Object.keys(items).map(item => {
    for (const category in itemList) {
      if (itemList[category][item]) {
        const item2 = itemList[category][item]
        return {
          name: `${getEmoji([`_${item}`])} ${item2.nameNomVsk.charAt(0).toUpperCase() + item2.nameNomVsk.slice(1)} x${items[item]}`,
          value: `id: \`${item2.ids[0]}\n\`` +
            `vērtība: **${item2.price}** ${latsOrLati(item2.price)}\n` +
            `izmantojams: ${item2.use ? '✅' : '❌'}`,
          inline: true,
        }
      }
    }
  })
}

export default {
  title: 'Inventārs',
  description: 'Apskatīt savu, vai kāda cita lietotāja inventāru',
  commands: ['inv', 'i', 'inventars'],
  cooldown: 1000,
  expectedArgs: '<@lietotājs>',
  maxArgs: 1,
  callback: async (message, args, a, client) => {
    const guildId = message.guildId
    let targetId = message.author.id

    // pārbauda vai ir ievadīts lietotājs, ja nav tad izvēlāts tad lietotājs būs ziņas autors
    if (args[0]) {
      const resultId = await getUserId(args[0], message.guild)

      if (resultId) targetId = resultId
      else return 0
    }

    const { items, itemCap, itemCount } = await findUser(guildId, targetId)

    // pārbauda vai inventārs nav tukšs
    if (!Object.keys(items).length) {
      message.reply(embedSaraksts(message, 'Inventārs',
        targetId === message.author.id ? '' : `<@${targetId}>`,
        [{ name: 'Tukšs inventārs', value: 'izmanto komandu `.bomžot`' }]
      ))
      return 1
    }

    let embedFieldArr = mapItems(items)

    const rand = Math.floor(Math.random() * 100000)
    let row = [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'Pārdot visu',
            style: 1,
            custom_id: `pardVisu ${rand}`,
          },
        ],
      },
    ]

    for (const atkr in itemList.atkritumi) {
      if (items[atkr] && !itemList.atkritumi[atkr].use) {
        row[0].components.push({
          type: 2,
          label: 'Pārdot nelietojamos atkritumus',
          style: 1,
          custom_id: `pardAtkr ${rand}`,
        })
        break
      }
    }

    for (const zivs in itemList.zivis) {
      if (items[zivs] && !itemList.zivis[zivs].use) {
        row[0].components.push({
          type: 2,
          label: 'Pārdot nelietojamās zivis',
          style: 1,
          custom_id: `pardZivis ${rand}`,
        })
        break
      }
    }

    if (items?.virve) {
      row[0].components.push({
        type: 2,
        label: 'Pakārties',
        style: 2,
        custom_id: `pakarties ${rand}`,
        emoji: {
          name: '_virve',
          id: emojiList['_virve']
        }
      })
    }

    const invValue = calcInvValue(items)

    const title = `Inventārs (${itemCount}/${itemCap})`
    const description = (targetId === message.author.id ? 'Tava' : `<@${targetId}>`) +
      ` inventāra vērtība: **${invValue}** ${latsOrLati(invValue)}`

    if (targetId !== message.author.id) {
      message.reply(embedSaraksts(message, title, description, embedFieldArr, '', 0x9d2235))
      return 1
    }

    await buttonEmbed({
      message,
      title,
      description,
      row,
      fields: embedFieldArr,
      color: 0x9d2235,
      cb: async i => {
        if (i.customId === `pardVisu ${rand}`) {
          return {
            id: `pardVisu ${rand}`,
            all: 1,
            after: async () => {
              await pardot.callback(message, ['visu'])
            }
          }
        } else if (i.customId === `pardAtkr ${rand}`) {
          return {
            id: `pardAtkr ${rand}`,
            after: async () => {
              await pardot.callback(message, ['a'])
            }
          }
        } else if (i.customId === `pardZivis ${rand}`) {
          return {
            id: `pardZivis ${rand}`,
            after: async () => {
              await pardot.callback(message, ['z'])
            }
          }
        } else if (i.customId === `pakarties ${rand}`) {
          return {
            id: `pakarties ${rand}`,
            after: async () => {
              await izmantot.callback(message, ['1'], null, null, i, 'virve')
            }
          }
        }
      }
    })

    return 1
  },
}