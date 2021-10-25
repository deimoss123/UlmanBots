import { embedSaraksts, embedTemplate } from '../../embeds/embeds.js'
import settingSchema from '../../schemas/settings-schema.js'
import mongo from '../../mongo.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export let settingsCache = {}

export default {
  title: 'Servera iestatījumi',
  description: 'Uzstādīt servera iestatījumus priekš UlmaņBota\n(tikai moderātoriem)',
  commands: ['iestatijumi'],
  cooldown: 0,
  expectedArgs: '',
  modCommand: 1,
  callback: async (message, args) => {
    const { guildId } = message

    console.log(args)

    return await mongo().then(async mongoose => {
      try {
        console.log(settingsCache[guildId])
        if (!settingsCache[guildId]) {
          const newSchema = {
            _id: guildId,
            kaktsRole: '',
            modRoles: [],
            spamChannels: [],
            autoDeleteChannels: [],
            autoRoles: [],
          }

          settingSchema[newSchema._id] = newSchema
          await new settingSchema(newSchema).save()
        }

        const index = settingsCache[guildId]

        const mapRoles = arr => {
          if (!arr.length) return '-'
          let str = ''
          arr.map(item => {
            str += `<@&${item}> `
          })
          return str
        }

        const mapChannels = arr => {
          if (!arr.length) return '-'
          let str = ''
          arr.map(item => {
            str += `<#${item}> `
          })
          return str
        }

        const checkArrMention = params => {
          if (!params.length) return 0
          for (const param of params) {
            if (!param.startsWith('<@&') || !param.endsWith('>')) return 0
          }
          return params.map(param => { return param.slice(3, -1) })
        }

        const checkChannelMention = params => {
          if (!params.length) return 0
          for (const param of params) {
            if (!param.startsWith('<#') || !param.endsWith('>')) return 0
          }
          return params.map(param => { return param.slice(2, -1) })
        }

        const removeDuplicates = (arr, setting) => {
          return arr.filter((item, pos, self) => {
            return self.indexOf(item) === pos && index[setting].indexOf(item) === -1
          })
        }

        const settings = {
          kakts: {
            name: '[kakts] Kakta loma',
            value: index?.kaktsRole ? `<@&${index.kaktsRole}>` : '-',
            key: 'kaktsRole',
            run: async params => {
              let arr = checkArrMention(params)
              if (!arr) return 'Nepareizi ievadīta loma'
              if (params.length > 1) return 'Tu vari pievienot tikai vienu kakta lomu'

              arr = removeDuplicates(arr, 'kaktsRole')
              index.kaktsRole = arr[0]
              return 0
            },
          },
          mod: {
            name: '[mod] Moderātoru loma/s (ļauj mainīt iestatījumus un kaktot)',
            value: mapRoles(index?.modRoles),
            key: 'modRoles',
            run: async params => {
              let arr = checkArrMention(params)
              if (!arr) return 'Nepareizi ievadīta loma/s'

              arr = removeDuplicates(arr, 'modRoles')
              index.modRoles.push(...arr)
              return 0
            }
          },
          spam: {
            name: '[spam] Kanāls/i kuros atļauts spams',
            value: mapChannels(index?.spamChannels),
            key: 'spamChannels',
            run: async params => {
              let arr = checkChannelMention(params)
              if (!arr) return 'Nepareizi ievadīts kanāls/i'

              arr = removeDuplicates(arr, 'spamChannels')
              index.spamChannels.push(...arr)
              return 0
            }
          },
          izdz: {
            name: '[izdz] Kanāls/i kuros automātiski izdzēšas UlmaņBota komandu atbildes',
            value: mapChannels(index?.autoDeleteChannels),
            key: 'autoDeleteChannels',
            run: async params => {
              let arr = checkChannelMention(params)
              if (!arr) return 'Nepareizi ievadīts kanāls/i'

              arr = removeDuplicates(arr, 'autoDeleteChannels')
              index.autoDeleteChannels.push(...arr)
              return 0
            }
          },
          auto: {
            name: '[auto] Loma/s kuras tiek automātiski iedotas lietotājiem ienākot serverī',
            value: mapRoles(index?.autoRoles),
            key: 'autoRoles',
            run: async params => {
              let arr = checkArrMention(params)
              if (!arr) return 'Nepareizi ievadīta loma/s'

              arr = removeDuplicates(arr, 'autoRoles')
              index.autoRoles.push(...arr)
              return 0
            }
          },
        }

        if (args.length < 2) {
          const resArr = Object.keys(settings).map(setting => {
            const { name, value } = settings[setting]
            return { name, value }
          })

          message.reply(embedSaraksts(message, 'Servera iestatījumi',
            'Lai mainītu iestatījumu izmanto komandu\n' +
            '`.iestatījumi <iestatījums> <parametri/dzēst>`\n\n' +
            'Piemēri:\n' +
            '`.iestatījumi kakts @loma`\n' +
            '`.iestatījumi izdz #kanāls1 #kanāls2`\n' +
            '`.iestatījumi auto dzēst`'
            , resArr, imgLinks.iestatijumi))
          return 2
        }

        if (!Object.keys(settings).includes(args[0])) return 0

        if (args[1] === 'dzest') {
          index[settings[args[0]].key] = settings[args[0]].key !== 'kaktsRole' ? [] : ''
          console.log(index[settings[args[0]].key])
          message.reply(embedTemplate(message, 'Servera iestatījumi',
            `**${settings[args[0]].name}** parametri tika izdzēsti`,
            imgLinks.iestatijumi))
          return 1
        }
        const [, ...temp] = args
        let res = await settings[args[0]].run(temp)
        if (!res) res = `**${settings[args[0]].name}** tika veiksmīgi iestatīts`
        message.reply(embedTemplate(message, 'Servera iestatījumi', res, imgLinks.iestatijumi))

        await settingSchema.findOneAndUpdate({ _id: guildId }, { ...settingsCache[guildId] }, {})
        return 1
      } catch (e) {
        console.error(e)
      }
    })
  },
}