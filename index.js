import { Intents, Client, Permissions } from 'discord.js'

import dotenv from 'dotenv'
import mongo from './mongo.js'

import { reakcijas } from './reakcijas/reakcijas.js'

import commandHandler from './commands/commandHandler.js'
import { antispam } from './antispam.js'

import settingsSchema from './schemas/settings-schema.js'
import mutesSchema from './schemas/mutes-schema.js'
import { settingsCache } from './commands/admin/iestatijumi.js'
import settingSchema from './schemas/settings-schema.js'
import redis from './redis.js'
import { stringifyItems, timeToText } from './helperFunctions.js'
import { calculateDiscounts } from './commands/items/veikals.js'

dotenv.config()

// definē DiscordJS klientu
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

const getDayOfMonth = async () => {
  const redisClient = await redis()
  return new Promise((res, rej) => {
    redisClient.get('dayofmonth', (err, r) => {
      if (err) return rej(err)
      return res(r)
    })
  })
}

// galvenais kods
client.on('ready', async () => {

  console.log('client ready')
  // mēģina savienoties ar mongo datubāzi
  await mongo().then(async mongoose => {
    try {
      console.log('connected to mongodb')

      const settings = await settingsSchema.find()

      settings.map(setting => {
        settingsCache[setting._id] = setting
      })
    } catch (e) {
      console.error(e)
    }
  })

  const guilds = await client.guilds.cache
  let i = 0
  guilds.forEach(guild => {
    i++
    console.log(`serv ${i}: ${guild.name} - ${guild.id}`)
  })


  const kaktsLoop = async () => {
    setTimeout(async () => {

      // parbauda kura diena menesi ir prieks veikala atlaidem
      let date = new Date()

      const currDay = await getDayOfMonth()

      if (currDay !== `${date.getDay()}`) {
        await calculateDiscounts()
        const redisClient = await redis()
        redisClient.set('dayofmonth', `${date.getDay()}`)
        console.log('discounts reset')
      }

      // kakti
      await mongo().then(async mongoose => {
        try {
          let kakti = await mutesSchema.find()

          kakti = kakti.filter(kakts => {
            return kakts.current && kakts.expires > 0 && kakts.expires <= Date.now()
          })

          //console.log(kakti, 'kakti')

          if (kakti.length) {
            for (const kakts of kakti) {
              console.log(kakts, 'kakts')
              await kaktsRole(kakts.guildId, kakts.userId, 1)

              await mutesSchema.findOneAndUpdate({
                userId: kakts.userId,
                guildId: kakts.guildId
              }, { current: false }, { new: true, upsert: true })
            }
          }
        } catch (e) {
          console.error(e)
        }
      })
      await kaktsLoop()
    }, 5000)
  }
  await kaktsLoop()


  client.on('guildMemberAdd', async member => {
    const { guild, id } = member

    await mongo().then(async mongoose =>{
      const currentMute = await mutesSchema.findOne({
        userId: id,
        guildId: guild.id,
        current: true
      })
      if (currentMute) await kaktsRole(guild.id, id)
    })

    if (settingsCache[guild.id]?.autoRoles?.length) {
      const randRoleId = settingsCache[guild.id].autoRoles[Math.floor(Math.random() * settingsCache[guild.id].autoRoles.length)]

      const newrole = await guild.roles.cache.find(role => {
        return role.id === randRoleId
      })

      await member.roles.add(newrole)
    }
  })

  const timeout = 20000

  client.on('messageCreate', async message => {

    if (!settingsCache[message.guildId]) {
      await mongo().then(async mongoose => {

        try {
          const newSchema = {
            _id: message.guildId,
            kaktsRole: '',
            modRoles: [],
            spamChannels: [],
            autoDeleteChannels: [],
            autoRoles: [],
          }

          settingSchema[newSchema._id] = newSchema
          await new settingSchema(newSchema).save()
        } catch (e) {
          console.error(e)
        }

      })
    }

    // pārbauda vai ziņa nav no bota
    if (message.author.id === process.env.ULMANISID) {
      if (settingsCache[message.guildId]?.autoDeleteChannels?.length) {
        settingsCache[message.guildId].autoDeleteChannels.map(channel => {
          if (channel === message.channelId && message.embeds.length) {
            setTimeout(() => {
              if (!message.deleted) message.delete()
            }, timeout)
          }
        })
      }
    } else {
      if (settingsCache[message.guildId]?.kaktsRole) await antispam(message)
      await commandHandler(client, message)
      await reakcijas(client, message)
    }
  })
})

export const kaktsRole = async (guildId, userId, isRemove = 0) => {
  const guild = await client.guilds.cache.get(guildId)
  const member = await guild.members.fetch(userId)

  const bot = await guild.members.fetch(process.env.ULMANISID)

  if (!bot.permissions.has([Permissions.FLAGS.MANAGE_ROLES])) return 0

  const kaktsRole = await guild.roles.cache.find(role => {
    return role.id === settingsCache[guildId].kaktsRole
  })

  if (isRemove) await member.roles.remove(kaktsRole)
  else await member.roles.add(kaktsRole)
  return 1
}

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log('logged in')
})
