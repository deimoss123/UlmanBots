import { imgLinks } from './imgLinks.js'
import { getEmoji } from '../reakcijas/atbildes.js'

export const ulmanversija = '3.1.2'

// saraksts ar reakciju embediem
export const reakcEmbeds = embedName => {
  // kopā ir 15 dīvaino zivju bildes kas ir uploadotas postimg.cc
  // embeds izvēlās randomā vienu no bildēm
  switch (embedName) {
    case 'zivs':
      return {
        color: 0x9d2235,
        image: {
          url: imgLinks.zivis[Math.floor(
            Math.random() * imgLinks.zivis.length)],
        },
      }
    case 'kabacis':
      return {
        color: 0x9d2235,
        image: {
          url: imgLinks.kabacis[Math.floor(
            Math.random() * imgLinks.kabacis.length)]
        },
      }
  }
}

export const embedTemplate = (message, title, description, imgUrls = null) => {
  let embed = {
    embeds: [
      {
        title,
        description,
        color: 0x9d2235,
        author: {
          name: message.member.displayName,
          icon_url: message.author.avatarURL(),
        },
        footer: {
          text: `UlmaņBots ${ulmanversija}`
        }
      }],
    allowedMentions: { 'users': [] },
  }

  // ja ir iedots imgurl tad pievieno thumbnailu embedam
  if (imgUrls) embed.embeds[0].thumbnail = {
    url: imgUrls.startsWith('https://') ? imgUrls : imgLinks[imgUrls][Math.floor(
      Math.random() * imgLinks[imgUrls].length)],
  }

  return embed
}

export const buttonEmbed = async (message, title, description, imgUrls = null, buttons, cb, fields = []) => {
  const time = 10000

  let embed

  if (fields.length) embed = embedSaraksts(message, title, description, fields, imgUrls)
  else embed = embedTemplate(message, title, description, imgUrls)

  buttons.map(btn => btn.type = 2)

  let row = [{
    type: 1,
    components: buttons
  }]

  embed.components = row
  console.log(embed)
  let msg = await message.reply(embed)

  const collector = message.channel.createMessageComponentCollector({ time })

  const disableAll = row => {
    row[0].components.map(btn => {
      btn.disabled = true
      if(btn.style === 1){
        btn.style = 2
      }
    })
    embed.components = row
    msg.edit(embed)
  }

  setTimeout(_ => {
    disableAll(row)
  }, time)

  collector.on('collect', async i => {
    if (message.author.id !== i.user.id) {
      await i.reply({ content: `Šī poga nav domāta tev dauni ${getEmoji(['nuja'])}`, ephemeral: true })
    }
    else {
      const result = await cb(i)
      if (result) {
        row[0].components.map(btn => {
          console.log(btn.custom_id, result)
          if (btn.custom_id === result.id) {
            btn.disabled = true
            btn.style = 3
            embed.components = row
            msg.edit(embed)
          }
        })
      }
      if (result?.all) disableAll(row)
    }

  })
  console.log(embed, 'embed')
}

export const embedError = (message, name, description) => {
  return {
    embeds: [
      {
        title: `Kļūda - ${name}`,
        description,
        color: 0x9d2235,
        author: {
          name: message.member.displayName,
          icon_url: message.author.avatarURL(),
        },
        thumbnail: {
          url: imgLinks.error[Math.floor(Math.random() * imgLinks.error.length)]
        },
        footer: {
          text: `UlmaņBots ${ulmanversija}`
        }
      }],
    allowedMentions: { 'users': [] },
  }
}

export const embedSaraksts = (message, title, description, fields, url) => {
  return {
    embeds: [
      {
        title,
        description,
        color: 0x9d2235,
        author: {
          name: message.member.displayName,
          icon_url: message.author.avatarURL(),
        },
        fields,
        thumbnail: { url },
        footer: {
          text: `UlmaņBots ${ulmanversija}`
        }
      }],
    allowedMentions: { 'users': [] },
  }
}