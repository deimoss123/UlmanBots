import { statusList } from '../../itemList.js'
import { checkStatus } from '../../ekonomija.js'
import { getUserId, timeToText } from '../../helperFunctions.js'
import { embedSaraksts } from '../../embeds/embeds.js'

export default {
  title: 'Statusu saraksts',
  description: 'Apskatīt savu, vai kāda cita lietotāja statusus',
  commands: ['status', 'statuss'],
  cooldown: 5000,
  maxArgs: 1,
  expectedArgs: '<@lietotājs>',
  callback: async (message, args) => {
    const guildId = message.guildId
    let targetId = message.author.id

    if (args[0]) {
      const resultId = getUserId(args[0])

      if (!resultId) return 0
      else targetId = resultId
    }

    let resultArr = []

    for (const key in statusList) {
      console.log(key)
      const statusResult = await checkStatus(guildId, targetId, key)

      resultArr.push({
        name: statusList[key].name,
        value: `${statusResult ? timeToText(statusResult) : '-'}`,
        inline: true,
      })
    }

    console.log(resultArr)
    message.reply(
      embedSaraksts('Statusu saraksts',
        `<@${targetId}>, Lai iegūtu statusu izmanto kādu lietu no inventāra`,
        resultArr, null))
    return 1
  },
}