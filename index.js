import { Intents, Client } from 'discord.js'

import dotenv from 'dotenv'
import mongo from './mongo.js'

import { reakcijas } from './reakcijas/reakcijas.js'

import commandHandler from './commands/commandHandler.js'
import { cacheKaktus, checkKakts } from './ekonomija.js'
import { antispam } from './antispam.js'

dotenv.config()

// kanāli kuros ziņas izdzēšas pēc noteikta laika
const channels = [
  '797584379685240885',
  '797587282672484392',
  '890662723648647249'
]

const timeout = 300000

// definē DiscordJS klientu
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

const kaktsLoop = async () => {
  setTimeout(async () => {
    await checkKakts()
    await kaktsLoop()
  }, 60000)
}

// galvenais kods
client.on('ready', async () => {
  console.log('client ready')
  
  // mēģina savienoties ar mongo datubāzi
  await mongo().then(mongoose => {
    try {
      console.log('connected to mongodb')
    } finally {
      mongoose.connection.close()
    }
  })

  await cacheKaktus()
  await kaktsLoop()

  client.on("messageCreate", async message => {
    // pārbauda vai ziņa nav no bota
    if (message.author.id === process.env.ULMANISID) {
      channels.map(channel => {
        if (channel === message.channelId) setTimeout(() => {
          message.delete()
        }, timeout)
      })
    } else {
      await antispam(message)
      await commandHandler(client, message)
      await reakcijas(client, message)
    }
  })
})

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log('logged in')
})

// okdd '798149915057717269'
const kaktsRoleId = '798149915057717269'

export const kaktsRole = async (guildId, userId, isAdd = 1) => {
  const guild = await client.guilds.cache.get(guildId)
  const kakts = await guild.roles.cache.get(kaktsRoleId)
  const member = await guild.members.cache.get(userId)
  if (isAdd) {
    await member.roles.add(kakts)
  } else {
    await member.roles.remove(kakts)
  }
}