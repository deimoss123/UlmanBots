import { emojiList } from '../../reakcijas/atbildes.js'

// laimesti 1
// depresija, nuja, trola, krutais, domajos, depresija, izbrinits, nuja



const sl = (msg) => {
  let i = 0
  const slots = () => {
    i++
    msg.edit(`${i}`)
    if (i < 4) setTimeout(() => slots(), 500)
    else {
      let str = ''
      for (const emoji in emojiList) {
        str = str.concat(`<:${emoji}:${emojiList[emoji]}> `)
      }
      msg.edit(str)
    }
  }
  slots()
}

// TODO pabeigt šito mēslu
export default {
  title: 'Fēnikss',
  description: 'Griezt vienu no Ulmaņa naudas aparātiem',
  commands: ['feniks', 'fenikss'],
  cooldown: 0,
  maxArgs: 1,
  callback: async (message, args) => {
    let msg = await message.reply('0')
    const r = await sl(msg)
    console.log(await r)
  }
}