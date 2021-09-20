import { Intents, Client } from 'discord.js'

import dotenv from 'dotenv'
import mongo from './mongo.js'

import { reakcijas } from './reakcijas/reakcijas.js'

import commandHandler from './commands/commandHandler.js'

dotenv.config()

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

  commandHandler(client)
  reakcijas(client)
})

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log('logged in')
})
