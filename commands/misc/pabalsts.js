import { buttonEmbed, embedError, embedTemplate } from '../../embeds/embeds.js'
import { addItems, addLati } from '../../ekonomija.js'
import izmantot from '../items/izmantot.js'

export default {
  title: 'Pabalsts',
  description: 'Pabalsts visiem izņemot draudziņdauņiem un lenkām',
  commands: ['pabalsts'],
  cooldown: 43200000,
  callback: async message => {
    const { guildId } = message
    const userId = message.author.id

    const martinsonsId = '517429149543956480'

    const roles = {
      modRole: {
        name: 'moderātoru',
        id: '859535871165333515',
        lati: 150,
      },
      itRole: {
        name: 'ITšņiku',
        id: '842856307097731093',
        lati: 150,
      },
      dizlatvRole: {
        name: 'dižLatviešu',
        id: '833663524517052426',
        lati: 100,
      },
      atbalstRole: {
        name: 'servera atbalstītāju',
        id: '844303819949342751',
        lati: 80,
      },
      zivsRole: {
        name: 'dīvaino zivju',
        id: '858053247176802344',
        lati: 50,
      },
      dizdaunRole: {
        name: 'diždauņu',
        id: '804256700517449728',
        lati: 30,
      },
      dizdraudzRole: {
        name: 'diždraudziņu',
        id: '804257079321296897',
        lati: 30,
      },
    }

    if (userId === martinsonsId) {
      const rand = Math.floor(Math.random() * 100000)
      const buttons = [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Izmantot',
              style: 1,
              custom_id: `izman ${rand}`,
            },
          ],
        },
      ]

      let count = 3

      await buttonEmbed(
        message, 'Pabalsts', 'Tu saņēmi martinsona pabalstu - 3 latloto biļetes', null, buttons,
        async i => {
          if (i.customId === `izman ${rand}`) {
            await izmantot.callback(message, ['1'], null, null, i, 'latloto')
            count--
            if (count <= 0) return { id: `izman ${rand}` }
          }
        })
      await addItems(guildId, userId, { latloto: 3 })
      return 1
    }

    for (const role in roles) {
      if (message.member.roles.cache.some(r => r.id === roles[role].id)) {
        console.log(role, 'role')
        message.reply(embedTemplate(
          message, 'Pabalsts',
          `Tu saņēmi ${roles[role].name} pabalstu **${roles[role].lati}** latu apmērā`))
        await addLati(guildId, userId, roles[role].lati)
        return 1
      }
    }
    message.reply(embedError(message, 'Pabalsts',
      'Lai saņemtu pabalstu tev vajag vismaz diždraudziņdauņa lomu'))
    return 2

  },
}