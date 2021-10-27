import { getEmoji } from '../../reakcijas/atbildes.js'
import { chance } from '../../helperFunctions.js'
import { embedError, embedTemplate, ulmanversija } from '../../embeds/embeds.js'
import { addLati, findUser, addData } from '../../ekonomija.js'
import { imgLinks } from '../../embeds/imgLinks.js'

// ~ 90% vidējais atgriezums
const laimesti = {
  varde: {
    chance: '*',
  },
  depresija: {
    chance: '*',
  },
  lenka: {
    chance: '*',
  },
  zivs: {
    chance: 0.18,
    multiplier: 0.05
  },
  nuja: {
    chance: 0.08,
    multiplier: 0.1
  },
  muskulis: {
    chance: 0.05,
    multiplier: 0.2
  },
  bacha: {
    chance: 0.04,
    multiplier: 0.5
  },
  izbrinits: {
    chance: 0.03,
    multiplier: 1
  },
  kabacis: {
    chance: 0.018,
    multiplier: 3
  },
  ulmanis: {
    chance: 0.01,
    multiplier: 5
  }
}

const floorTwo = num => { return Math.floor(num * 100) / 100 }

const generateRow = (laim) => {
  let resArr = []
  let totalMultiplier = 0

  for (let i = 0; i < 5; i++) {
    resArr.push(chance(laim))
    if (laim[resArr[i]].multiplier) totalMultiplier += laim[resArr[i]].multiplier
  }

  return {
    row: resArr,
    totalMultiplier
  }
}

const riggedRow = laim => {
  let resArr = []
  let totalMultiplier = 0

  for (let i = 0; i < 5; i++) {
    resArr.push('ulmanis')
    if (laim[resArr[i]].multiplier) totalMultiplier += laim[resArr[i]].multiplier
  }

  return {
    row: resArr,
    totalMultiplier
  }
}

const testChances = (laim) => {
  let m = 0
  for (let j = 0; j < 1000000; j++) {
    let totalMultiplier = 0
    let resArr = []

    for (let i = 0; i < 5; i++) {
      resArr.push(chance(laim))
      if (laim[resArr[i]].multiplier) totalMultiplier += laim[resArr[i]].multiplier
    }
    m += totalMultiplier
  }
  console.log(m / 1000000)
}

// EJ NAHUJ ŠITO HUIŅU

const slotsEmbed = (message, emojis, won, multiplier, lati) => {
  let izsauk = ''
  for (let i = 0; i < Math.floor(multiplier) + 1; i++) izsauk += '!'

  let res, color
  if (won !== 0) {
    if (Math.floor(multiplier) < 1) color = 0xe3911e
    else if (multiplier === 1) color = 0xe6de0e
    else color = 0x1ed402
    res = `<@${message.author.id}> LAIMĒJA **${Math.round(won)}** LATUS **${izsauk}**`
  }
  else {
    color = 0xd40202
    res = `<@${message.author.id}> neko nelaimēja :(`
  }

  const cloneEmojis = [...emojis]

  cloneEmojis.map((e, i) => cloneEmojis[i] = getEmoji(e))

  return {
    embeds: [{
      title: 'Ulmaņa naudas aparāts',
      description: `Likme - ${lati} lati\n` +
        `${won !== undefined ? `${res} \n\n` : '⠀\n\n'}`  +
        `${cloneEmojis[0].join(' ')}\n` +
        `${cloneEmojis[1].join(' ')}\n` +
        '---------------------\n' +
        `${cloneEmojis[2].join(' ')}\n` +
        '---------------------\n' +
        `${cloneEmojis[3].join(' ')}\n` +
        `${cloneEmojis[4].join(' ')}`,
      author: {
        name: message.member.displayName,
        icon_url: message.author.avatarURL(),
      },
      color: won !== undefined ? color : 0x000,
      footer: {
        text: `UlmaņBots ${ulmanversija}`
      }
    }],
    allowedMentions: { 'users': [] },
  }
}

const sl = async (message, win, lati, args) => {
  let emojis = [ [], [], [], [], [] ]

  // ģenerēt pirmās līnijas
  emojis.map((_, i) => emojis[i] = generateRow(laimesti).row)

  let msg = await message.reply(slotsEmbed(message, emojis, undefined, undefined, lati))

  let j = 0
  emojis.pop()
  emojis.unshift(win.row)

  const slots = () => {

    if (j < 2) setTimeout(async _ => {
      j++

      msg.edit(slotsEmbed(message, emojis, undefined, undefined, lati))

      emojis.pop()
      emojis.unshift(generateRow(laimesti).row)

      slots()
    }, 1000)

    else setTimeout(_ => {
      let winEmbed = slotsEmbed(message, emojis, lati * win.totalMultiplier, win.totalMultiplier, lati)

      let rand = Math.floor(Math.random() * 100000)
      winEmbed.components = [{
        type: 1,
        components: [{
          type: 2,
          label: 'Griezt vēlreiz',
          style: 1,
          custom_id: `griezt ${rand}`
        }]
      }]

      msg.edit(winEmbed)

      const btn = winEmbed.components[0].components[0]

      const time = 5000
      const collector = message.channel.createMessageComponentCollector({ time })

      setTimeout(_ => {
        btn.disabled = true
        if (btn.style === 1) btn.style = 2
        msg.edit(winEmbed)
      }, time)

      collector.on('collect', async i => {
        if (i.customId === `griezt ${rand}` && message.author.id === i.user.id) {

          const res = await feniks.callback(message, [args])

          btn.disabled = true
          btn.style = res === 1 ? 3 : 4

          await i.update(winEmbed)
        }
      })
    }, 1000)
  }

  slots()
}

export const feniks = {
  title: 'Fēnikss',
  description: 'Griezt vienu no Ulmaņa naudas aparātiem',
  commands: ['feniks', 'fenikss', 'fenka', 'aparats', 'griezt'],
  cooldown: 5000,
  maxArgs: 1,
  callback: async (message, args) => {
    //testChances(laimesti)

    const guildId = message.guildId
    const userId = message.author.id

    const likmes = ['50', '100', '200', '500', '1000', '2000', '5000']
    let reizinataji = ''

    Object.keys(laimesti).map(l => {
      if (laimesti[l].multiplier) {
        reizinataji += getEmoji([l]) + ` x${laimesti[l].multiplier}\n`
      }
    })

    if (!args[0]) {
      message.reply(embedTemplate(message, 'Fenikss',
        'Lai grieztu aparātu izmanto komandu `.feniks <likme>`\n' +
        `Pieejamās likmes - **${likmes.join(', ')}** lati\n\n` +
        'Lai grieztu aparātu ar nejauši izvēlētu likmi izmanto `.feniks virve`\n' +
        'Griezt aparātu ar visu savu naudu - `.feniks viss`\n\n' +
        '**Reizinātāji**\n' +
        `${reizinataji}`
      , imgLinks.fenikss))
      return 2
    }

    const { lati } = await findUser(guildId, userId)
    let likme = args[0]


    if (likme === 'virve'){
      if (lati < 50) {
        message.reply(embedError(message, 'Fenikss',
          `Lai grieztu pašnāvnieku aparātu tev vajag vismaz 50 latus\nTev ir **${
          floorTwo(lati).toFixed(2)}** lati`))
        return 2
      }
      else likme = Math.floor( Math.random() * (lati - 50) ) + 50
    } else if (likme === 'viss') {
      if (lati < 50) {
        message.reply(embedError(message, 'Feniks',
          `Tev vajag vismaz 50 latus lai grieztu aparātu\nTev ir **${
            floorTwo(lati).toFixed(2)}** lati`))
        return 2
      } else likme = Math.floor(lati)
    } else if (!likmes.includes(likme)) {
      message.reply(embedError(message, 'Fenikss', 'Tu neesi izvēlējies pareizu likmi\n' +
        `Pieejamās likmes - **${likmes.join(', ')}** lati\n` +
        'Griezt ar nejauši izvēlētu likmi - `.feniks virve`\n' +
        'Griezt visu savu naudu - `.feniks viss`'
      ))
      return 2
    } else {
      if (lati < likme) {
        message.reply(embedError(message, 'Fenikss',
          `Tev nepietiek naudas lai grieztu aparātu ar **${likme}** latu likmi\nTev ir **${
            floorTwo(lati).toFixed(2)}** lati`))
        return 2
      }
    }

    let win
    if (userId === '222631002265092096' && 0) win = riggedRow(laimesti)
    else win = generateRow(laimesti)
    await sl(message, win, likme, args[0])


    const resLati = (likme * -1) + Math.round(likme * win.totalMultiplier)

    await addLati(guildId, process.env.ULMANISID, likme * 0.1)
    await addLati(guildId, userId, resLati)

    let dataUser = { feniksSpend: parseInt(likme), feniksWin: parseInt(likme) + resLati, feniksCount: 1 }
    const { data } = await findUser(guildId, userId)
    if (data.maxFeniksWin <= parseInt(likme) + resLati)
      dataUser.maxFeniksWin = `=${parseInt(likme) + resLati}`
    if (data.maxFeniksLikme <= likme) dataUser.maxFeniksLikme = `=${likme}`

    await addData(guildId, userId, dataUser)
    return 1
  }
}