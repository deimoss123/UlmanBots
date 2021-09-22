import { Intents, Client } from 'discord.js'

import dotenv from 'dotenv'
import mongo from './mongo.js'

import { reakcijas } from './reakcijas/reakcijas.js'

import commandHandler from './commands/commandHandler.js'

dotenv.config()

// kanāli kuros ziņas izdzēšas pēc noteikta laika
const channels = [
  '875123318842351757',
  '875083366611955715'
]

const timeout = 10000

// definē DiscordJS klientu
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
})

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
  client.on("messageCreate", async message => {
    // pārbauda vai ziņa nav no bota
    if (message.author.id === '884514288012759050') {
      channels.map(channel => {
        if (channel === message.channelId) setTimeout(() => {
          message.delete()
        }, timeout)
      })
    } else {
      await commandHandler(client, message)
      await reakcijas(client, message)
    }
  })
})

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log('logged in')
})
