import {
  buttonEmbed,
  embedError,
  embedSaraksts,
  embedTemplate,
  noPing,
} from '../../embeds/embeds.js'
import { addItems, addLati, checkStatus, findUser } from '../../ekonomija.js'
import izmantot from './izmantot.js'
import { getEmoji } from '../../reakcijas/atbildes.js'
import { okddId } from '../../index.js'

// okdd roles
const roles = {
  modRole: {
    name: 'Moderātoru',
    id: '859535871165333515',
    lati: 30,
  },
  itRole: {
    name: 'ITšņiku',
    id: '842856307097731093',
    lati: 30,
  },
  dizlatvRole: {
    name: 'DižLatviešu',
    id: '833663524517052426',
    lati: 25,
  },
  atbalstRole: {
    name: 'Servera atbalstītāju',
    id: '844303819949342751',
    lati: 20,
  },
  zivsRole: {
    name: 'Dīvaino zivju',
    id: '858053247176802344',
    lati: 15,
  },
  dizdaunRole: {
    name: 'DižDauņu',
    id: '804256700517449728',
    lati: 10,
  },
  dizdraudzRole: {
    name: 'DižDraudziņu',
    id: '804257079321296897',
    lati: 10,
  },
}

export default {
  title: 'Pabalsts',
  description: 'Saņemt bezdarbnieku pabalstu',
  commands: ['pabalsts'],
  cooldown: 43200000,
  callback: async message => {
    const { guildId } = message
    const userId = message.author.id

    const bezdarbPabalsts = 15

    // tikai okdd pabalsti
    const martinsonsId = '517429149543956480'

    if (userId === martinsonsId) {
      const rand = Math.floor(Math.random() * 100000)

      let count = 4

      let buttons = [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: `Izmantot (${count}/4)`,
              style: 1,
              custom_id: `izman ${rand}`,
            },
          ],
        },
      ]

      await addItems(guildId, userId, { latloto: count })

      let txt = ''

      if (!await checkStatus(guildId, userId, 'vakcinets')) {
        txt = `Bezdarbnieku pabalstu: **${bezdarbPabalsts}** lati\n`
        await addLati(guildId, userId, bezdarbPabalsts)
      }

      await buttonEmbed({
        message,
        fields: [{
          name: 'Tu saņēmi',
          value: `${txt}Martinsona pabalstu: ${getEmoji(['_latloto'])} Latloto biļete x4`
        }],
        row: buttons,
        cb: async i => {
          if (i.customId === `izman ${rand}`) {
            await izmantot.callback(message, ['1'], null, null, i, 'latloto')
            count--
            buttons[0].components[0].label = `Izmantot (${count}/4)`
            if (count <= 0) {

              return { id: `izman ${rand}`, editComponents: buttons }
            }
            return { id: `izman ${rand}`, editComponents: buttons, dontDisable: true }
          }
        }
      })

      return 1
    }

    let txt = ''
    let totalLati = 0

    if (!await checkStatus(guildId, userId, 'vakcinets')) {
      txt += `Bezdarbnieku pabalstu: **${bezdarbPabalsts}** lati\n`
      totalLati += bezdarbPabalsts
    }

    if (guildId === okddId) {
      for (const role in roles) {
        if (message.member.roles.cache.some(r => r.id === roles[role].id)) {
          txt += `${roles[role].name} pabalstu: **${roles[role].lati}** lati`
          totalLati += roles[role].lati
          break
        }
      }
    }

    if (!txt) {
      message.reply(noPing(
        'Lai saņemtu pabalstu tev vajag būt bezdarbniekam (bez "vakcinēts" statusa)'))
      return 2
    }

    message.reply(embedSaraksts(message, '', '', [{
      name: 'Tu saņēmi',
      value: txt
    }], '', 0xd6e835))

    await addLati(guildId, userId, totalLati)

    return 1
  },
}