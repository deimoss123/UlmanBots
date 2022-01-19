import { checkStatus, addLati, addItems, findUser, removeOneDateCooldown } from '../../ekonomija.js'
import { buttonEmbed, embedError, embedTemplate, noPing } from '../../embeds/embeds.js'
import { chance, stringifyItems } from '../../helperFunctions.js'
import { itemList } from '../../itemList.js'

const cmdUses = 5

export default {
  title: 'Strādāt',
  description: 'Strādāt veikalā',
  commands: ['stradat', 'darbs'],
  uses: cmdUses,
  extraUses: 0,
  cooldown: 600000,
  callback: async message => {
    const guildId = message.guildId
    const userId = message.author.id

    const { itemCount, itemCap, dateCooldowns } = await findUser(guildId, userId)

    if (dateCooldowns['Strādāt'].uses < 1) {
      message.reply(noPing('Tu šodien vairs nevari strādāt'))
      return 2
    }

    if (!await checkStatus(guildId, userId, 'vakcinets')) {
      message.reply(noPing(
        'Lai strādātu tev vajag būt vakcinētam, ' +
        'vakcīnu var atrast atkritumos ar komandu `.bomžot`'))
      return 2
    }

    if (itemCap - itemCount < 1) {
      const vietas = itemCap - itemCount <= 0 ? 0 : itemCap - itemCount
      message.reply(noPing(
        `Lai strādātu tev vajag vismaz 1 brīvu vietu inventārā\n` +
        `Tev inventārā ir **${vietas}** brīvas vietas`))
      return 2
    }

    const rand = Math.floor(Math.random() * 100000)
    const row = [{
      type: 1,
      components: [{
        type: 2,
        label: 'Godīgi strādāt',
        style: 1,
        custom_id: `stradat ${rand}`
      }, {
        type: 2,
        label: 'Strādāt un zagt',
        style: 1,
        custom_id: `zagt ${rand}`
      }]
    }]

    const minAlga = 10
    const maxAlga = 20
    const bonus = 10

    let lati = Math.floor((Math.random() * (maxAlga-minAlga)) + minAlga)

    const strChance = {
      stradat: {
        parastStr: {
          chance: '*',
          text: 'Tu pastrādāji veikalā un nopelnīji'
        },
        bonuss: {
          chance: 0.2,
          bonus,
          text: `Tu labi pastrādāji un priekšnieks par darbu iedeva ${bonus} latu bonusu, tu nopelnīji`
        }
      },
      zagt: {
        piekera: {
          chance: '*',
          text: 'Zogot tevi pieķēra priekšnieks un aizsūtīja mājās'
        },
        izdevas: {
          chance: 0.4,
          text: `Tu nopelnīji **${lati}** latus un no noliktavas nozagi `,
          items: {
            virve: { chance: '*' },
            makskere: { chance: 0.3 },
            latloto: { chance: 0.3 },
            nazis: { chance: 0.1 },
          }
        }
      }
    }

    await buttonEmbed({
      message,
      commandTitle: 'Strādāt',
      title: `Strādāt (${dateCooldowns['Strādāt'].uses}/${cmdUses})`,
      description: 'Ko tu vēlies darīt?',
      row,
      color: 0xed694e,
      cb: async i => {
        if (i.customId === `stradat ${rand}`) {
          const { text, bonus = 0 } = strChance.stradat[chance(strChance.stradat)]

          await addLati(guildId, userId, lati + bonus)

          await removeOneDateCooldown(guildId, userId, 'Strādāt')
          const { dateCooldowns } = await findUser(guildId, userId)

          return {
            id: `stradat ${rand}`,
            editComponents: [],
            editTitle: `Strādāt (${dateCooldowns['Strādāt'].uses}/${cmdUses})`,
            deactivate: true,
            edit:
              'Izvēle: `Godīgi strādāt`\n\n' +
              `${text} **${lati + bonus}** latus`
          }
        }

        if (i.customId === `zagt ${rand}`) {
          const { text, items = null } = strChance.zagt[chance(strChance.zagt)]

          await removeOneDateCooldown(guildId, userId, 'Strādāt')
          const { dateCooldowns } = await findUser(guildId, userId)

          let txt = text
          if (items) {
            let item = {}
            item[chance(items)] = 1

            txt += stringifyItems(item)

            await addLati(guildId, userId, lati)
            await addItems(guildId, userId, item)
          }

          return {
            id: `zagt ${rand}`,
            editTitle: `Strādāt (${dateCooldowns['Strādāt'].uses}/${cmdUses})`,
            editComponents: [],
            deactivate: true,
            edit: 'Izvēle: `Zagt`\n\n' + txt
          }
        }
      }
    })

    return 1
  },
}