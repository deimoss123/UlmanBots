import { chance, stringifyItems } from '../../helperFunctions.js'
import { addItems, addLati, findUser } from '../../ekonomija.js'
import { buttonEmbed, embedError, embedTemplate } from '../../embeds/embeds.js'
import izmantot from '../items/izmantot.js'

export default {
  title: 'Ubagot',
  description: 'Ubagot uz ielas',
  commands: ['ubagot', 'ubags'],
  cooldown: 1800000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    const { itemCount, itemCap } = await findUser(guildId, userId)

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(embedError(message, 'Ubagot',
        `Lai ubagotu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }

    const itemObj = { oditiscitrus: 1 }

    const ubagotChance = {
      yesItem: { chance: 0.5 },
      noItem: { chance: '*' }
    }

    const rand = Math.floor(Math.random() * 100000)
    const row = [{
      type: 1,
      components: [{
        type: 2,
        label: 'Izmantot',
        style: 1,
        custom_id: `izm ${rand}`
      }]
    }]

    // izvēlās cik naudu var dabūt no ubagošanas
    const lati = Math.floor(((Math.random() * 5) + 3) * 100) / 100
    await addLati(guildId, userId, lati)

    let text = `Tu noubagoji **${lati.toFixed(2)}** latus`

    if (chance(ubagotChance) === 'noItem') {
      message.reply(embedTemplate(message, 'Ubagot', text, 'ubagot'))
      return 1
    }

    await addItems(guildId, userId, itemObj)

    await buttonEmbed(message,
      'Ubagot', text + ` un ${stringifyItems(itemObj)}`, 'ubagot', row, async i => {
        if (i.customId === `izm ${rand}`) {
          await izmantot.callback(message, ['1'], null, null, i, Object.keys(itemObj)[0])
          return { id: `izm ${rand}` }
        }
      })

    return 1
  },
}