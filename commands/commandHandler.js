import commandBase from './commandBase.js'

import { latToEng } from '../helperFunctions.js'

// visu komandu importi
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

const commands = [
  maks, addLati, addItem, bomzot, ubagot, inventars, top, veikals, pirkt, pardot
]

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

      let i = 0
      commands.map(command => {
        command.commands.map(cmd => {
          if (userCommand === cmd) commandBase(client, message, cmd, commands[i])
        })
        i++
      })
    }
  })
}