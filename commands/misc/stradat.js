import { checkStatus, addLati, addItems, findUser } from '../../ekonomija.js'
import { buttonEmbed, embedError, embedTemplate } from '../../embeds/embeds.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { itemList } from '../../itemList.js'

export default {
  title: 'Strādāt',
  description: 'Strādāt veikalā',
  commands: ['stradat', 'darbs'],
  cooldown: 3600000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    const { itemCount, itemCap } = await findUser(guildId, userId)

    if (!await checkStatus(guildId, userId, 'vakcinets')) {
      message.reply(embedError(message, 'Strādāt',
        'Lai strādātu tev vajag būt vakcinētam, ' +
        'vakcīnu vai sertifikātu var atrast atkritumos ar komandu `.bomžot`'))
      return 2
    }

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(embedError(message, 'Strādāt',
        `Lai strādātu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }

    const rand = Math.floor(Math.random() * 100000)
    const buttons = [
      {
        label: 'Godīgi strādāt',
        style: 1,
        custom_id: `stradat ${rand}`
      },
      {
        label: 'Strādāt un zagt',
        style: 1,
        custom_id: `zagt ${rand}`
      }
    ]

    let lati = Math.floor((Math.random() * 10) + 15)

    const strChance = {
      stradat: {
        parastStr: {
          chance: '*',
          text: 'Tu pastrādāji veikalā un nopelnīji'
        },
        bonuss: {
          chance: 0.2,
          bonus: 10,
          text: 'Tu labi pastrādāji un priekšnieks par darbu iedeva bonusu, tu nopelnīji'
        }
      },
      zagt: {
        piekera: {
          chance: '*',
          text: 'Zogot tevi pieķēra priekšnieks un aizsūtīja mājās'
        },
        izdevas: {
          chance: 0.5,
          text: `Tu nopelnīji **${lati}** latus un no noliktavas nozagi `,
          items: {
            kartonakaste: itemList.atkritumi.kartonakaste,
            virve: itemList.veikals.virve,
            nazis: itemList.veikals.nazis,
            mullermilch: itemList.veikals.mullermilch
          }
        }
      }
    }

    await buttonEmbed(message, 'Strādāt', 'Ko tu vēlies darīt?', null, buttons, async i => {
      if (i.customId === `stradat ${rand}`) {
        const { text, bonus = 0 } = strChance.stradat[chance(strChance.stradat)]

        message.reply(embedTemplate(message, 'Strādāt', `${text} **${lati + bonus}** latus`, 'stradat'))
        await addLati(guildId, userId, lati + bonus)
        return { id: `stradat ${rand}`, all: 1 }
      }

      if (i.customId === `zagt ${rand}`) {
        const { text, items = null } = strChance.zagt[chance(strChance.zagt)]

        let txt = text
        if (items) {
          let item = {}
          item[chance(items)] = 1

          txt += stringifyItems(item)

          await addLati(guildId, userId, lati)
          await addItems(guildId, userId, item)
        }

        message.reply(embedTemplate(message, 'Strādāt', txt, 'stradat'))
        return { id: `zagt ${rand}`, all: 1 }
      }
    })

    return 1
  },
}