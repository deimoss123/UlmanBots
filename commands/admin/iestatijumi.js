import { embedSaraksts, embedTemplate } from '../../embeds/embeds.js'
import settingSchema from '../../schemas/settings-schema.js'
import mongo from '../../mongo.js'
import { imgLinks } from '../../embeds/imgLinks.js'

export let settingsCache = {}

const mapChannels = arr => {
  if (!arr.length) return '-'
  let str = ''
  arr.map(item => {
    str += `<#${item}> `
  })
  return str
}

const removeDuplicates = (arr, setting, index) => {
  return arr.filter((item, pos, self) => {
    return self.indexOf(item) === pos && index[setting].indexOf(item) === -1
  })
}

const checkChannelMention = async (guild, params) => {
  if (!params.length) return 0
  for (const param of params) {
    if (!param.startsWith('<#') || !param.endsWith('>')) return 0
    if (!await guild.channels.cache.find(ch => ch.id === param.slice(2, -1))) return 0
  }

  return params.map(param => { return param.slice(2, -1) })
}

export default {
  title: 'Servera iestatījumi',
  description: 'Uzstādīt servera iestatījumus priekš UlmaņBota\n(tikai moderātoriem)',
  commands: ['iestatijumi'],
  cooldown: 0,
  expectedArgs: '',
  modCommand: 1,
  callback: async (message, args) => {
    const { guildId, guild } = message

    return await mongo().then(async mongoose => {
      try {
        if (!settingsCache[guildId]) {
          const newSchema = {
            _id: guildId,
            allowedChannels: [],
          }

          settingSchema[newSchema._id] = newSchema
          await new settingSchema(newSchema).save()
        }

        const index = settingsCache[guildId]

        const settings = {
          kanali: {
            name: '[kanali] Kanāli kuros atļautas UlmaņBota komandas',
            value: mapChannels(index?.allowedChannels),
            key: 'allowedChannels',
            run: async params => {
              let arr = await checkChannelMention(guild, params)
              if (!arr) return 'Nepareizi ievadīts kanāls/i'

              arr = removeDuplicates(arr, 'allowedChannels', index)
              index.allowedChannels.push(...arr)
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
            '`.iestatījumi kanali #kanāls1 #kanāls2`\n' +
            '`.iestatījumi kanali dzēst`'
            , resArr, imgLinks.iestatijumi))
          return 2
        }

        if (!Object.keys(settings).includes(args[0])) return 0

        if (args[1] === 'dzest') {
          index[settings[args[0]].key] = []
          message.reply(embedTemplate(message, 'Servera iestatījumi',
            `**${settings[args[0]].name}** parametri tika izdzēsti`,
            imgLinks.iestatijumi))
          await settingSchema.findOneAndUpdate({ _id: guildId }, { ...settingsCache[guildId] }, {})
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