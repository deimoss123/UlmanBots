import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { addData, addLati, checkStatus, findUser } from '../../ekonomija.js'
import { embedSaraksts, noPing } from '../../embeds/embeds.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Maksat',
  description: 'Pārskaitīt naudu kādam lietotājam',
  commands: ['maksat', 'parskaitit', 'samaksat'],
  cooldown: 0,
  expectedArgs: '<@lietotajs> <daudzums>',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    let latiAmount = floorTwo(args[1])

    let targetId = await getUserId(args[0], message.guild)
    if (!targetId || isNaN(latiAmount)) return 0

    if (targetId === userId) {
      message.reply(noPing('Tu nevari maksāt sev'))
      return 2
    }

    if (latiAmount < 1) {
      message.reply(noPing('Minimālais maksāšanas daudzums ir **1** lats'))
      return 2
    }

    if (targetId === process.env.ULMANISID) {
      message.reply(noPing('Tu nevari maksāt valsts bankai'))
      return 2
    }

    const user = await findUser(guildId, userId)
    const target = await findUser(guildId, targetId)

    let nodoklis = 1.1
    if (await checkStatus(guildId, userId, 'juridisks')) nodoklis = 1

    const arNodokli = floorTwo(latiAmount * nodoklis)
    const nodoklisLati = floorTwo(arNodokli - latiAmount)

    if (floorTwo(user.lati) < arNodokli) {
      message.reply(noPing(
        `Tev nav ${arNodokli.toFixed(2)} ${latsOrLati(arNodokli)}\n` +
        `Tu maksimāli vari maksāt **${floorTwo(user.lati / nodoklis).toFixed(2)}** latus`))
      return 2
    }

    message.reply(embedSaraksts(message, 'Maksāt',
      `Tu iedevi **${latiAmount.toFixed(2)}** latus <@${targetId}>\n` +
      `Nodoklis: ${nodoklisLati.toFixed(2)} ${latsOrLati(nodoklisLati)}`,
      [
        {
          name: 'Maksātājs',
          value: `${(user.lati - arNodokli).toFixed(2)} ${latsOrLati(user.lati - arNodokli)}`,
          inline: true,
        }, {
        name: 'Saņēmējs',
        value: `${floorTwo(target.lati + latiAmount).toFixed(2)} ${
          latsOrLati(floorTwo(target.lati + latiAmount))}`,
        inline: true,
      },
      ], '', 0x8d42cf))

    // noņem no lietotāja
    await addLati(guildId, userId, arNodokli * -1)
    // pievieno naudu mērķim
    await addLati(guildId, targetId, latiAmount)
    // pievieno nodokli valsts bankai

    let dataUsr = { sentMoney: latiAmount }
    if (nodoklis !== 1) {
      await addLati(guildId, process.env.ULMANISID, nodoklisLati)
      dataUsr.taxPaid = nodoklisLati
    }

    await addData(guildId, userId, dataUsr)
    await addData(guildId, targetId, { receivedMoney: latiAmount })

    return 1

  },
}