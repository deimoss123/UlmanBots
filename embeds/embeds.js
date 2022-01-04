import { imgLinks } from './imgLinks.js'
import { getEmoji } from '../reakcijas/atbildes.js'
import { activeCommands } from '../commands/commandHandler.js'

export const ulmanversija = '3.3.1'
const footer = `Versija: ${ulmanversija}⠀|⠀Veidotājs: Deimoss#1984`
const footerUrl = 'https://i.postimg.cc/W3fvhpJp/Karlis-Ulmanis.jpg'

export const noPing = (description, fields = []) => {
  return {
    embeds: [{
      description,
      color: 0xffffff,
      fields
    }],
    allowedMentions: { 'users': [] }
  }
}

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

export const embedTemplate = (message, title, description, imgUrls = null, color = 0x000, imageLarge = null) => {
  let embed = {
    embeds: [
      {
        title,
        description,
        color,
        author: {
          name: message.member.displayName,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
        footer: {
          text: footer,
          icon_url: footerUrl
        }
      }],
    allowedMentions: { 'users': [] },
  }

  // ja ir iedots imgurl tad pievieno thumbnailu embedam
  if (imgUrls) embed.embeds[0].thumbnail = {
    url: imgUrls.startsWith('https://') ? imgUrls : imgLinks[imgUrls][Math.floor(
      Math.random() * imgLinks[imgUrls].length)],
  }

  if (imageLarge) embed.embeds[0].image = { url: imageLarge }

  return embed
}

export const buttonEmbed = async options => {
  const {
    message,
    commandTitle = '',
    row = [],
    cb,
    title = '',
    description = '',
    imgUrls = null,
    fields = [],
    color = 0x000000,
    max = 999,
    time = 15000,
    func = () => {}
  } = options

  const { guildId } = message
  const userId = message.author.id

  activeCommands[`${guildId}-${userId}`][commandTitle] = true

  let row0 = row
  let embed, timeoutId = 0

  if (fields.length) embed = embedSaraksts(message, title, description, fields, imgUrls, color)
  else embed = embedTemplate(message, title, description, imgUrls, color)

  embed.components = row0

  let msg = await message.reply(embed)
  const result = await func(msg)
  if (result) embed = result

  const collector = message.channel.createMessageComponentCollector({ max, time: 300000 })

  const disableAll = row0 => {
    row0.map(item => {
      item.components.map(btn => {
        btn.disabled = true
        if(btn.type === 2 && btn.style === 1) btn.style = 2
      })
    })
    embed.components = row0
    clearTimeout(timeoutId)
  }

  const disableTimer = (row0) => {
    timeoutId = setTimeout(_ => {
      disableAll(row0)
      msg.edit(embed)
      delete activeCommands[`${guildId}-${userId}`][commandTitle]
    }, time)
  }

  disableTimer(row0)

  collector.on('collect', async i => {
    if (userId === i.user.id) {
      const result = await cb(i)
      if (result) {
        row0.map(key => {
          key.components.map(async btn => {
            if (btn.custom_id === result.id) {
              embed.embeds = i.message.embeds
              embed.components = row0

              if (result?.editTitle) embed.embeds[0].title = result.editTitle

              if (result?.edit || result?.edit === '') embed.embeds[0].description = result.edit
              if (result?.editFields) embed.embeds[0].fields = result.editFields

              if (result?.all) disableAll(row0)

              if (result?.deactivate) activeCommands[`${guildId}-${userId}`][commandTitle] = 0

              if (!i.isSelectMenu()) {
                btn.style = 3
                btn.disabled = true
                if (result?.value) btn.label = result.value
                if (result?.dontDisable) {
                  btn.style = 1
                  btn.disabled = false
                  clearTimeout(timeoutId)
                  disableTimer(row0)
                }
              } else {
                btn.placeholder = result?.value
              }

              if (result?.editComponents) {
                embed.components = result.editComponents
                row0 = embed.components
                clearTimeout(timeoutId)
                disableTimer(row0)
              }

              await i.update(embed)
              if (result?.after) result.after()
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
        title: name ? `Kļūda - ${name}` : '',
        description,
        color: 0xff0000,
      }],
    allowedMentions: { 'users': [] },
  }
}

export const embedSaraksts = (message, title, description, fields, imgUrls, color = 0x000) => {
  let embed = {
    embeds: [
      {
        title,
        description,
        color,
        author: {
          name: message.member.displayName,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
        fields,
        footer: {
          text: footer,
          icon_url: footerUrl
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