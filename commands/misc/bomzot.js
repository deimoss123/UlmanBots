import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems } from '../../ekonomija.js'
import { buttonEmbed } from '../../embeds/embeds.js'
import pardot from '../ekonomija/pardot.js'
import izmantot from '../items/izmantot.js'

export default {
  title: 'Bomžot',
  description: 'Iet atkritumu meklējumos',
  commands: ['bomzot', 'bomzis'],
  cooldown: 1800000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    let items = {}

    // izvēlās atkritumu daudzumu
    const itemCount = Math.floor((Math.random() * 3) + 2)

    // izvēlās randomā noteiktu itemu daudzumu
    for (let i = 0; i < itemCount; i++) {
      const item = chance(itemList.atkritumi)
      items[item] = items[item] ? items[item] + 1 : 1
    }

    const rand = Math.floor(Math.random() * 100000)
    let buttons = [{
      label: 'Pārdot visus nelietojamos atkritumus',
      style: 1,
      custom_id: `pardAtkr ${rand}`
    }]

    let counts = {}
    Object.keys(items).map(item => {
      if (itemList.atkritumi[item].use) {
        counts[item] = items[item]
        buttons.push({
          label: `Izmantot ${itemList.atkritumi[item].nameAkuVsk}`,
          style: 2,
          custom_id: `izmantot ${item} ${rand}`
        })
      }
    })

    //message.reply(embedTemplate(message, 'Bomžot', `Tu atradi ${stringifyItems(items)}`, 'atkritumi'))
    await buttonEmbed(message, 'Bomžot', `Tu atradi ${stringifyItems(items)}`, 'atkritumi', buttons,
      async i => {
        if (i.customId === `pardAtkr ${rand}`) {
          await pardot.callback(message, ['a'], null, null, i)
          return {id: `pardAtkr ${rand}`}
        } else {
          for (const item in counts) {
            if (i.customId === `izmantot ${item} ${rand}`) {
              await izmantot.callback(message, ['1'], null, null, i, item)
              console.log(counts)
              counts[item] -= 1
              if (counts[item] <= 0) return { id: `izmantot ${item} ${rand}` }
            }
          }
        }
      })

    await addItems(guildId, userId, items)
    return 1
  },
}