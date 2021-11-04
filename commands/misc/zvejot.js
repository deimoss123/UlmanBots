import { itemList } from '../../itemList.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, checkStatus, findUser } from '../../ekonomija.js'
import { buttonEmbed, embedError } from '../../embeds/embeds.js'
import { imgLinks } from '../../embeds/imgLinks.js'
import pardot from '../ekonomija/pardot.js'
import izmantot from '../items/izmantot.js'

export default {
  title: 'Zvejot',
  description: 'Zvejot dižLatvijas ezeros',
  commands: ['zvejot', 'makskeret', 'copet'],
  cooldown: 3600000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    const { itemCount, itemCap } = await findUser(guildId, userId)

    if (!await checkStatus(guildId, userId, 'zvejotajs')) {
      message.reply(embedError(message, 'Zvejot',
        'Lai zvejotu tev vajag būt licencētam zvejniekam, nopērc no veikala zvejošanas licenci un izmanto to'))
      return 2
    }

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(embedError(message, 'Zvejot',
        `Lai zvejotu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }

    let item = {}
    const rand = Math.floor(Math.random() * 100000)

    let row = [{
      type: 1,
      components: [{
        type: 2,
        label: 'Pārdot visas nelietojamās zivis',
        style: 1,
        custom_id: `pardZivis ${rand}`,
      }]
    }]

    item[chance(itemList.zivis)] = 1

    if (itemList.zivis[Object.keys(item)[0]].use) {
      row = [{
        type: 1,
        components: [{
          type: 2,
          label: 'Izmantot',
          style: 1,
          custom_id: `izman ${rand}`,
        }]
      }]
    }

    await buttonEmbed(message, 'Zvejošana', `Tu nozvejoji ${stringifyItems(item)}`,
      imgLinks.zivis[11], row, async i => {
        if (i.customId === `pardZivis ${rand}`) {
          await pardot.callback(message, ['z'], null, null, i)
          return { id: `pardZivis ${rand}` }
        } else if (i.customId === `izman ${rand}`) {
          await izmantot.callback(message, ['1'], null, null, i, Object.keys(item)[0])
          return { id: `izman ${rand}` }
        }
      })
    await addItems(guildId, userId, item)
    return 1

  },
}