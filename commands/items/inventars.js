import { findUser } from '../../ekonomija.js'
import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { buttonEmbed, embedSaraksts } from '../../embeds/embeds.js'
import { itemList } from '../../itemList.js'
import pardot from '../ekonomija/pardot.js'
import { getEmoji } from '../../reakcijas/atbildes.js'

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

    const { items } = await findUser(guildId, targetId)

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
      let buttons = [
        {
          label: 'Pārdot visu',
          style: 1,
          custom_id: `pardVisu ${rand}`
        },
      ]

      for (const atkr in itemList.atkritumi) {
        if (items[atkr] && !itemList.atkritumi[atkr].use) {
          buttons.push({
            label: 'Pārdot nelietojamos atkritumus',
            style: 1,
            custom_id: `pardAtkr ${rand}`
          })
          break
        }
      }

      for (const zivs in itemList.zivis) {
        if (items[zivs] && !itemList.zivis[zivs].use) {
          buttons.push({
            label: 'Pārdot nelietojamās zivis',
            style: 1,
            custom_id: `pardZivis ${rand}`
          })
          break
        }
      }

      if (targetId !== message.author.id) {
        message.reply(embedSaraksts(message, 'Inventārs', `<@${targetId}>`, embedFieldArr))
        return 2
      }

      await buttonEmbed(message, 'Inventārs', `<@${targetId}>`, null, buttons, async i => {
        if (targetId !== i.user.id) {
          await i.reply({ content: `Šī poga nav domāta tev dauni ${getEmoji(['nuja'])}`, ephemeral: true })
        } else if (i.customId === `pardVisu ${rand}`) {
          await pardot.callback(message, ['visu'], null, null, i)
          return {id: `pardVisu ${rand}`, all: 1}
        }
        else if (i.customId === `pardAtkr ${rand}`) {
          await pardot.callback(message, ['a'], null, null, i)
          return {id: `pardAtkr ${rand}`}
        }
        else if (i.customId === `pardZivis ${rand}`) {
          await pardot.callback(message, ['z'], null, null, i)
          return {id: `pardZivis ${rand}`}
        }
      }, embedFieldArr)
    } else { // inventārs tukšs
      message.reply(embedSaraksts(message, 'Inventārs',
        `<@${targetId}>`, [{ name: 'Tukšs inventārs', value: 'izmanto komandu `.bomžot`' }]))
    }

    return 1
  },
}