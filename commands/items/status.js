import { statusList } from '../../itemList.js'
import { checkStatus } from '../../ekonomija.js'
import { getUserId, timeToText } from '../../helperFunctions.js'
import { embedSaraksts } from '../../embeds/embeds.js'

export default {
  title: 'Statusu saraksts',
  description: 'Apskatīt savu, vai kāda cita lietotāja statusus',
  commands: ['status', 'statuss', 'statusi'],
  cooldown: 1000,
  maxArgs: 1,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {
    const guildId = message.guildId
    let targetId = message.author.id

    if (args[0]) {
      if (args[0] === 'info') {
        let embedArr = []
        Object.keys(statusList).map(key => {
          embedArr.push({
            name: statusList[key].name,
            value: statusList[key].description
          })
        })
        message.reply(embedSaraksts(message, 'Statusu saraksts', 'Statusu paskaidrojumi', embedArr, '', 0xff94b4))
        return 2
      } else {
        const resultId = await getUserId(args[0], message.guild)

        if (!resultId) return 0
        else targetId = resultId
      }
    }

    let resultArr = []

    for (const key in statusList) {
      const statusResult = await checkStatus(guildId, targetId, key)

      resultArr.push({
        name: statusList[key].name,
        value: `\`\`\`${statusResult ? timeToText(statusResult) : '-'}\`\`\``,
        inline: true,
      })
    }

    message.reply(
      embedSaraksts(message, 'Statusu saraksts',
        `<@${targetId}>` + ', statusu paskaidrojumi - `.status info`',
        resultArr, '', 0xff94b4))
    return 1
  },
}