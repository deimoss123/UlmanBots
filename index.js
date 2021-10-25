import { Intents, Client } from 'discord.js'

import dotenv from 'dotenv'
import mongo from './mongo.js'

import { reakcijas } from './reakcijas/reakcijas.js'

import commandHandler from './commands/commandHandler.js'
import { antispam } from './antispam.js'

import settingsSchema from './schemas/settings-schema.js'
import mutesSchema from './schemas/mutes-schema.js'
import { settingsCache } from './commands/admin/iestatijumi.js'
import settingSchema from './schemas/settings-schema.js'

dotenv.config()

// definē DiscordJS klientu
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

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
      await mongo().then(async mongoose => {
        try {
          let kakti = await mutesSchema.find({ guildId: "836650380095914035" })

          //console.log(kakti, 'kakti')

          kakti = kakti.filter(kakts => {
            //console.log(kakts.userId, 'id')
            //console.log(kakts.current)
            //console.log(kakts.expires > 0)
            //console.log(kakts.expires <= Date.now())
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

  const kaktsRole = await guild.roles.cache.find(role => {
    return role.id === settingsCache[guildId].kaktsRole
  })

  if (isRemove) await member.roles.remove(kaktsRole)
  else await member.roles.add(kaktsRole)
}

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log('logged in')
})
