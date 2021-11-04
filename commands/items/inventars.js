import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { buttonEmbed, embedSaraksts } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import pardot from '../ekonomija/pardot.js'
import izmantot from './izmantot.js'

export const calcInvValue = items => {
  let invValue = 0
  Object.keys(items).map(invItem => {
    Object.keys(itemList).map(category => {
      if (itemList[category][invItem]) {
        invValue += itemList[category][invItem].price * items[invItem]
      }
    })
  })
  return invValue
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
      const resultId = getUserId(args[0])

      if (resultId) targetId = resultId
      else return 0
    }

    const { items, itemCap, itemCount } = await findUser(guildId, targetId)

    // pārbauda vai inventārs nav tukšs
    if (Object.keys(items).length) {
      let embedFieldArr = []
      let i = 0
      for (const key of Object.keys(items)) {
        let item // categorija (veikals, atkritumi utt)
        for (const keydb of Object.keys(itemList)) {
          if (itemList[keydb][key]) {
            item = itemList[keydb][key]
            break
          }
        }

        // izveido inventāra embed sarakstu
        embedFieldArr.push({
          name: '`' + `[${embedFieldArr.length + 1}] ${
            item.nameNomVsk.charAt(0).toUpperCase() + item.nameNomVsk.slice(1)}` + '`',
          value: `daudzums - ${items[key]}\nvērtība - **${item.price}** ${latsOrLati(
            item.price)}\nlietojams - ${item.use ? '✅' : '❌'}`,
          inline: true,
        })
        i++
      }

      const rand = Math.floor(Math.random() * 100000)
      let row = [{
        type: 1,
        components: [{
          type: 2,
          label: 'Pārdot visu',
          style: 1,
          custom_id: `pardVisu ${rand}`,
        },]
      }]

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
          custom_id: `pakarties ${rand}`
        })
      }

      const invValue = calcInvValue(items)

      const title = `Inventārs (${itemCount}/${itemCap})`
      const description = `<@${targetId}> inventāra vērtība - **${invValue}** ${latsOrLati(
        invValue)}`

      if (targetId !== message.author.id) {
        message.reply(embedSaraksts(message, title, description, embedFieldArr))
        return 1
      }

      await buttonEmbed(message, title, description, null, row, async i => {
        if (i.customId === `pardVisu ${rand}`) {
          await pardot.callback(message, ['visu'], null, null, i)
          return { id: `pardVisu ${rand}`, all: 1 }
        } else if (i.customId === `pardAtkr ${rand}`) {
          await pardot.callback(message, ['a'], null, null, i)
          return { id: `pardAtkr ${rand}` }
        } else if (i.customId === `pardZivis ${rand}`) {
          await pardot.callback(message, ['z'], null, null, i)
          return { id: `pardZivis ${rand}` }
        } else if (i.customId === `pakarties ${rand}`) {
          await izmantot.callback(message, ['1'], null, null, i, 'virve')
          return { id: `pakarties ${rand}` }
        }
      }, embedFieldArr)

    } else { // inventārs tukšs
      message.reply(embedSaraksts(message, 'Inventārs',
        `<@${targetId}>`, [{ name: 'Tukšs inventārs', value: 'izmanto komandu `.bomžot`' }]))
    }

    return 1
  },
}