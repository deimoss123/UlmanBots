import { embedSaraksts } from '../../embeds/embeds.js'
import { commands } from '../commandHandler.js'

export default {
  title: 'Palīdzība',
  description: 'Apskatīt visas komandas serverī',
  commands: ['palidziba', 'help', 'paliga'],
  cooldown: 10000,
  callback: async message => {
    const resultArr = []

    commands.map(cmd => {
      if (cmd.title !== 'AddLati') resultArr.push({
        name: `.${cmd.commands[0]} ${cmd.expectedArgs ? cmd.expectedArgs : ''}`,
        value: `${cmd.description}`
      })
    })

    message.reply(embedSaraksts(message, 'Palīdzība', 'Visas Ulmaņa komandas', resultArr))
  }
}