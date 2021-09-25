import { getUserId, latsOrLati } from '../../helperFunctions.js'
import { addLati, findUser } from '../../ekonomija.js'
import { embedError, embedTemplate } from '../../embeds/embeds.js'

const floorTwo = num => { return Math.floor(num * 100) / 100 }

export default {
  title: 'Maksat',
  description: 'Pārskaitīt naudu kādam lietotājam',
  commands: ['maksat', 'parskaitit'],
  cooldown: 1000,
  expectedArgs: '<@lietotajs> <daudzums>',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, args) => {
    const guildId = message.guildId
    const userId = message.author.id

    let latiAmount = floorTwo(args[1])

    let targetId = getUserId(args[0])
    if (!targetId || isNaN(latiAmount)) return 0

    if (latiAmount < 1) {
      message.reply(embedError('maksāt', `Minimālais maksāšanas daudzums ir 1 lats`))
      return 2
    }

    const user = await findUser(guildId, userId)
    const target = await findUser(guildId, targetId)

    const nodoklis = 1.1
    //latiAmount = floorTwo(latiAmount * nodoklis)

    const arNodokli = floorTwo(latiAmount * nodoklis)
    const nodoklisLati = floorTwo(arNodokli - latiAmount)

    if (floorTwo(user.lati) < arNodokli) {
      message.reply(embedError('maksāt',
        `Tev nav ${arNodokli.toFixed(2)} ${latsOrLati(
          arNodokli)}\nTu maksimāli vari maksāt ${floorTwo(
          user.lati / nodoklis).toFixed(2)} latus`))
      return 2
    } else {
      message.reply(embedTemplate('Maksāt',
        `Tu iedevi ${latiAmount.toFixed(2)} latus <@${targetId}>, ${nodoklisLati.toFixed(2)} ${
          latsOrLati(nodoklisLati)} aizgāja nodokļos\n<@${
          targetId}> tagad ir ${floorTwo(target.lati + latiAmount).toFixed(2)} ${
          latsOrLati(floorTwo(target.lati + latiAmount))}\nTev palika ${
          (user.lati - arNodokli).toFixed(2)} ${latsOrLati(user.lati - arNodokli)}`))

      // noņem no lietotāja
      await addLati(guildId, userId, arNodokli * -1)
      // pievieno naudu mērķim
      await addLati(guildId, targetId, latiAmount)
      // pievieno nodokli valsts bankai
      await addLati(guildId, '884514288012759050', nodoklisLati)

      return 1
    }
  },
}