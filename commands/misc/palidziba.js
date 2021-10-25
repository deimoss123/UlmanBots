import { ulmanversija } from '../../embeds/embeds.js'
import { commands } from '../commandHandler.js'

export default {
  title: 'Palīdzība',
  description: 'Apskatīt visas komandas serverī',
  commands: ['palidziba', 'help', 'paliga'],
  cooldown: 0,
  callback: message => {
    let embedArr = []

    Object.keys(commands).map(category => {
      let resultArr = []
      commands[category].map(cmd => {
        if (cmd.title !== 'AddLati' && cmd.title !== 'AddItem') resultArr.push({
          name: '`' + `.${cmd.commands[0]} ${cmd.expectedArgs ? cmd.expectedArgs : ''}` + '`',
          value: `${cmd.description}`
        })
      })
      embedArr.push({
        title: category,
        description: '',
        color: 0x9d2235,
        fields: resultArr
      })
    })

    embedArr[embedArr.length - 1].footer = {text: `UlmaņBots ${ulmanversija}`}

    message.reply({ embeds: embedArr,  allowedMentions: { 'users': [] }})

    return 1
  }
}