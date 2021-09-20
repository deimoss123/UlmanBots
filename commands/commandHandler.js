import commandBase from './commandBase.js'
import commandList from './commandList.js'

import { latToEng } from '../helperFunctions.js'

// visu komandu importi
import add from './temp/add.js'
import ping from './temp/ping.js'
import maks from './ekonomija/maks.js'
import addLati from './ekonomija/addLati.js'
import addItem from './ekonomija/addItem.js'
import bomzot from './misc/bomzot.js'
import ubagot from './misc/ubagot.js'
import inventars from './items/inventars.js'
import top from './ekonomija/top.js'
import veikals from './items/veikals.js'
import pirkt from './ekonomija/pirkt.js'
import pardot from './ekonomija/pardot.js'


// atrod komandu iekš commandList
const findCommand = (userCommand) => {
  for (const item of commandList) {
    for (const cmd of item.commands) {
      if (cmd === userCommand) {
        return item.name
      }
    }
  }
}


// šitais fails ir neorganizēta miskaste
export default (client) => {

  client.on('messageCreate', message => {

    // pārbauda vai sūtītā ziņa nav no bota
    if (message.author.id === '884514288012759050' || message.channelId !==
      '884514924288671744') return


    const content = latToEng(message.content.toLowerCase())

    // pārbauda vai ziņa sākas ar . (tad tā būs komanda)
    if (content.startsWith('.')) {

      // sadala ziņu array, pirmā ziņa būs komanda
      const args = content.split(/[ ]+/)

      // lietotāja komanda, kas tiks pārbaudīta un salīdzināta ar citām komandām
      // noņem . no komandas
      const userCommand = args[0].slice(1)

      const temp = findCommand(userCommand)
      console.log(temp, 'result')

      // šeit sākās šausmas
      switch (temp) {
        case 'add':
          commandBase(client, message, userCommand, add); break
        case 'ping':
          commandBase(client, message, userCommand, ping); break
        case 'maks':
          commandBase(client, message, userCommand, maks); break
        case 'addLati':
          commandBase(client, message, userCommand, addLati); break
        case 'addItem':
          commandBase(client, message, userCommand, addItem); break
        case 'bomzot':
          commandBase(client, message, userCommand, bomzot); break
        case 'ubagot':
          commandBase(client, message, userCommand, ubagot); break
        case 'inventars':
          commandBase(client, message, userCommand, inventars); break
        case 'top':
          commandBase(client, message, userCommand, top); break
        case 'veikals':
          commandBase(client, message, userCommand, veikals); break
        case 'pirkt':
          commandBase(client, message, userCommand, pirkt); break
        case 'pardot':
          commandBase(client, message, userCommand, pardot); break
      }
    }
  })
}