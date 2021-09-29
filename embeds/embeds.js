import { imgLinks } from './imgLinks.js'

const ulmanversija = '3.0'

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