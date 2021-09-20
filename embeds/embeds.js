import { imgLinks } from './imgLinks.js'

// saraksts ar reakciju embediem
export const reakcEmbeds = embedName => {
  // kopā ir 15 dīvaino zivju bildes kas ir uploadotas postimg.cc
  // embeds izvēlās randomā vienu no bildēm
  switch (embedName) {
    case 'zivs':
      return {
        image: {
          url: imgLinks.zivis[Math.floor(
            Math.random() * imgLinks.zivis.length)],
        },
      }
  }
}

export const itemTemplate = (title, description, url) => {
  return {
    embeds: [
      {
        title,
        description,
        color: 0x9d2235,
        author: {
          name: 'UlmaņBots 3.0',
          icon_url: imgLinks.ulmanis,
        },
        thumbnail: { url }
      }],
    allowedMentions: { 'users': [] },
  }
}

export const embedTemplate = (title, description, imgUrls) => {
  let embed = {
    embeds: [
      {
        title,
        description,
        color: 0x9d2235,
        author: {
          name: 'UlmaņBots 3.0',
          icon_url: imgLinks.ulmanis,
        },
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

export const embedError = (name, description) => {
  return {
    embeds: [
      {
        title: `Kļūda - ${name}`,
        description,
        color: 0x9d2235,
        author: {
          name: 'UlmaņBots 3.0',
          icon_url: imgLinks.ulmanis,
        },
        thumbnail: {
          url: imgLinks.error[Math.floor(Math.random() * imgLinks.error.length)]
        }
      }],
    allowedMentions: { 'users': [] },
  }
}

export const embedSaraksts = (title, description, fields, url) => {
  return {
    embeds: [
      {
        title,
        description,
        color: 0x9d2235,
        author: {
          name: 'UlmaņBots 3.0',
          icon_url: imgLinks.ulmanis,
        },
        fields,
        thumbnail: { url }
      }],
    allowedMentions: { 'users': [] },
  }
}