import { imgLinks } from './imgLinks.js'
import { getEmoji } from '../reakcijas/atbildes.js'

export const ulmanversija = '3.2.3'

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

export const embedTemplate = (message, title, description, imgUrls = null, color = 0x9d2235) => {
  let embed = {
    embeds: [
      {
        title,
        description,
        color,
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

export const buttonEmbed = async (message, title, description, imgUrls = null, row, cb, fields = [], color, isReply = 0, max = 999) => {
  const time = 15000

  let embed

  if (fields.length) embed = embedSaraksts(message, title, description, fields, imgUrls)
  else embed = embedTemplate(message, title, description, imgUrls)

  embed.components = row

  let msg = await message.reply(embed)

  const collector = message.channel.createMessageComponentCollector({ time, max })

  const disableAll = row => {
    row.map(item => {
      item.components.map(btn => {
        btn.disabled = true
        if(btn.type === 2 && btn.style === 1) btn.style = 2
      })
    })
    embed.components = row
    clearTimeout(timeoutId)
  }

  const timeoutId = setTimeout(_ => {
    disableAll(row)
    msg.edit(embed)
  }, time)

  collector.on('collect', async i => {
    if (message.author.id === i.user.id) {
      const result = await cb(i)
      if (result) {
        row.map(key => {
          key.components.map(async btn => {
            if (btn.custom_id === result.id) {
              embed.components = row

              if (result?.edit) embed.embeds[0].description = result.edit
              if (result?.editComponents) embed.components = result.editComponents

              if (result?.all) disableAll(row)

              if (!i.isSelectMenu()) {
                if (result?.value) btn.label = result.value
                btn.disabled = result?.disable ? result.disable : true
                btn.style = 3
              } else {
                btn.placeholder = result?.value
              }

              await i.update(embed)
            }
          })
        })
      }
    }
  })
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