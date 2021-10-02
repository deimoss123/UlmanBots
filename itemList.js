import { addLati, addStatus, findUser } from './ekonomija.js'
import { chance, timeToText } from './helperFunctions.js'
import { imgLinks } from './embeds/imgLinks.js'

/*
template objekts priekš kopēšanas
name: {
  nameNomVsk: '',
  nameNomDsk: '',
  nameAkuVsk: '',
  nameAkuDsk: '',
  price: 0,
  chance: 0,
  usable: 0,
  url: null
  use: async message => {

  }
},

 */

// šis ir objekts ar visiem iespējamiem itemiem

// katram itemam ir 4 name:
// 1) nominatīvs (kas?) vienskaitlis
// 2) nominatīvs (kas?) daudzskaitlis
// 3) akuzatīvs (ko?) vienskaitlis
// 4) akuzatīvs (ko?) daudzskaitlis

// es ienīstu latviešu valodu

export const itemList = {
  // preces kas nopērkamas veikalā
  veikals: {
    mullermilch: {
      nameNomVsk: 'mullermilch',
      nameNomDsk: 'mullermilch',
      nameAkuVsk: 'mullermilch',
      nameAkuDsk: 'mullermilch',
      price: 450,
      chance: 0,
      url: 'https://i.postimg.cc/QtJ3QLXq/mullermilch.jpg',
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id,
          { aizsardziba: statusList.aizsardziba.time })
        return `Tu izdzēri mullermilch, tavi kauli palika daudz stiprāki\nTu esi aizsargāts no zagšanas **${timeToText(
          result.aizsardziba - Date.now(), 2)}**`
      },
    },
    makskere: {
      nameNomVsk: 'zvejošans licence',
      nameNomDsk: 'zvejošans licences',
      nameAkuVsk: 'zvejošans licenci',
      nameAkuDsk: 'zvejošans licences',
      price: 175,
      chance: 0,
      url: 'https://i.postimg.cc/B603PZG6/makskere.jpg',
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id,
          { zvejotajs: statusList.zvejotajs.time })
        return `Tu agresīvi paskatījies uz zvejošanas licenci\nTu vari zvejot **${timeToText(
          result.zvejotajs - Date.now(), 2)}**`
      },
    },
    dizloto: {
      nameNomVsk: 'dižloto biļete',
      nameNomDsk: 'dižloto biļetes',
      nameAkuVsk: 'dižloto biļeti',
      nameAkuDsk: 'dižloto biļetes',
      price: 150,
      chance: 0,
      url: 'https://i.postimg.cc/SK8qK233/latloto.jpg',
      use: async message => {
        const laimesti = {
          massive: {
            name: 'milzīgo',
            chance: 0.01,
            reward: 4000
          },
          big: {
            name: 'lielo',
            chance: 0.08,
            reward: 800
          },
          mid: {
            name: 'vidējo',
            chance: 0.15,
            reward: 400
          },
          small: {
            name: 'mazo',
            chance: 0.3,
            reward: 175
          },
          nothing: {
            name: 'neko',
            chance: '*',
            reward: 0
          }
        }
        const res = chance(laimesti)

        if (laimesti[res].name !== 'neko') {
          await addLati(message.guildId, message.author.id, laimesti[res].reward)
          return `Tu vinnēji ${laimesti[res].name} laimestu - **${laimesti[res].reward}** latus`
        } else {
          return `Tu neko nevinnēji :(`
        }
      },
    },
    nazis: {
      nameNomVsk: 'nazis',
      nameNomDsk: 'naži',
      nameAkuVsk: 'nazi',
      nameAkuDsk: 'nažus',
      price: 100,
      chance: 0,
      url: 'https://i.postimg.cc/3NrH9LNQ/nazis.jpg',
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { laupitajs: statusList.laupitajs.time })
        return `Tu izvilki nazi un agresīvi sāki skatīties uz garāmgājējiem\nTavai zagšanai ir palielināta efektivitāte **${
          timeToText(result.laupitajs - Date.now(), 2)}**`
      },
    },
    zemenurasens: {
      nameNomVsk: 'zemeņu Rāsēns',
      nameNomDsk: 'zemeņu Rāsēni',
      nameAkuVsk: 'zemeņu Rāsēnu',
      nameAkuDsk: 'zemeņu Rāsēnus',
      price: 55,
      chance: 0,
      url: 'https://i.postimg.cc/bYLPdjVy/zemenurasens.jpg',
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { aizsardziba: 3600000 })
        return `Tu izdzēri zemeņu Rāsēnu, tavi kauli palika nedaudz stiprāki\nTu esi aizsargāts no zagšanas **${
          timeToText(result.aizsardziba - Date.now(), 2)}**`
      },
    },
    latloto: {
      nameNomVsk: 'latloto biļete',
      nameNomDsk: 'latloto biļetes',
      nameAkuVsk: 'latloto biļeti',
      nameAkuDsk: 'latloto biļetes',
      price: 50,
      chance: 0,
      url: 'https://i.postimg.cc/SK8qK233/latloto.jpg',
      use: async message => {
        const laimesti = {
          massive: {
            name: 'milzīgo',
            chance: 0.01,
            reward: 1000
          },
          big: {
            name: 'lielo',
            chance: 0.08,
            reward: 250
          },
          mid: {
            name: 'vidējo',
            chance: 0.15,
            reward: 120
          },
          small: {
            name: 'mazo',
            chance: 0.3,
            reward: 50
          },
          nothing: {
            name: 'neko',
            chance: '*',
            reward: 0
          }
        }
        const res = chance(laimesti)

        if (laimesti[res].name !== 'neko') {
          await addLati(message.guildId, message.author.id, laimesti[res].reward)
          return `Tu vinnēji ${laimesti[res].name} laimestu - **${laimesti[res].reward}** latus`
        } else {
          return `Tu neko nevinnēji :(`
        }
      },
    },
    virve: {
      nameNomVsk: 'virve',
      nameNomDsk: 'virves',
      nameAkuVsk: 'virvi',
      nameAkuDsk: 'virves',
      price: 10,
      chance: 0,
      url: 'https://i.postimg.cc/zvdYQnHb/virve.jpg',
      use: async message => {
        const { lati } = await findUser(message.guildId, message.author.id)
        await addLati(message.guildId, message.author.id, lati * -1)
        return `Tu pakāries un pazaudēji visu savu naudu`
      },
    },
  },

  // atkritumi, iegūstami no bomžošanas
  atkritumi: {
    zabaks: {
      nameNomVsk: 'lietots zābaks',
      nameNomDsk: 'lietoti zābaki',
      nameAkuVsk: 'lietotu zābaku',
      nameAkuDsk: 'lietotus zābakus',
      price: 10,
      chance: '*',
    },
    stiklapudele: {
      nameNomVsk: 'stikla pudele',
      nameNomDsk: 'stikla pudeles',
      nameAkuVsk: 'stikla pudeli',
      nameAkuDsk: 'stikla pudeles',
      price: 3,
      chance: '*',
    },
    plastpudele: {
      nameNomVsk: 'plastmasas pudele',
      nameNomDsk: 'plastmasas pudeles',
      nameAkuVsk: 'plastmasa pudeli',
      nameAkuDsk: 'plastmasas pudeles',
      price: 1,
      chance: '*',
    },
    metalluznis: {
      nameNomVsk: 'metāllūznis',
      nameNomDsk: 'metāllūžņi',
      nameAkuVsk: 'metāllūzni',
      nameAkuDsk: 'metāllūžņus',
      price: 2,
      chance: '*',
    },
    kartonakaste: {
      nameNomVsk: 'kartona kaste',
      nameNomDsk: 'kartona kastes',
      nameAkuVsk: 'kartona kasti',
      nameAkuDsk: 'kartona kastes',
      price: 0.5,
      chance: '*',
    },
    stiklaburka: {
      nameNomVsk: 'stikla burka',
      nameNomDsk: 'stikla burkas',
      nameAkuVsk: 'stikla burku',
      nameAkuDsk: 'stikla burkas',
      price: 3,
      chance: '*',
    },
    konservi: {
      nameNomVsk: 'tukša konservu bundža',
      nameNomDsk: 'tukšas konservu bundžas',
      nameAkuVsk: 'tukšu konservu bundžu',
      nameAkuDsk: 'tukšas konservu bundžas',
      price: 2,
      chance: '*',
    },
    plastdaksa: {
      nameNomVsk: 'plastmasas dakšiņa',
      nameNomDsk: 'plastmasas dakšiņas',
      nameAkuVsk: 'plastmasas dakšiņu',
      nameAkuDsk: 'plastmasas dakšiņas',
      price: 0.5,
      chance: '*',
    },
    avize: {
      nameNomVsk: 'avīze',
      nameNomDsk: 'avīzes',
      nameAkuVsk: 'avīzi',
      nameAkuDsk: 'avīzes',
      price: 1,
      chance: '*',
    },
    oditiscitrus: {
      nameNomVsk: 'odekolons "Citrus"',
      nameNomDsk: 'odekoloni "Citrus"',
      nameAkuVsk: 'odekolonu "Citrus"',
      nameAkuDsk: 'odekolonus "Citrus"',
      price: 10,
      chance: 0.05,
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { bomzis: statusList.bomzis.time })
        return `Tu izpisi odīti un sāki smirdēt\nTu vari biežāk nodarboties ar bomžošanu **${timeToText(
          result.bomzis - Date.now(), 2)}**`
      },
    },
    covidsertifikats: {
      nameNomVsk: 'Covid-19 sertifikāts',
      nameNomDsk: 'Covid-19 sertifikāti',
      nameAkuVsk: 'Covid-19 sertifikātu',
      nameAkuDsk: 'Covid-19 sertifikātus',
      price: 50,
      chance: 0.05,
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { vakcinets: statusList.vakcinets.time / 2 })
        return `Tu nolaizīji covid sertifikātu un kļuvi vakcinēts\nTu vari strādāt veikalā **${timeToText(
          result.vakcinets - Date.now(), 2)}**`
      },
    },
    sputnikvakc: {
      nameNomVsk: '"Sputnik V" vakcīna',
      nameNomDsk: '"Sputnik V" vakcīnas',
      nameAkuVsk: '"Sputnik V" vakcīnu',
      nameAkuDsk: '"Sputnik V" vakcīnas',
      price: 50,
      chance: 0.05,
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { vakcinets: statusList.vakcinets.time })
        return `Tu sev iedūri okupantu šļirci un kļuvi vakcinēts\nTu vari strādāt veikalā **${timeToText(
          result.vakcinets - Date.now(), 2)}**`
      },
    },
  },
  zivis: {
    draudzinzivs: {
      nameNomVsk: 'draudziņzivs',
      nameNomDsk: 'draudziņzivis',
      nameAkuVsk: 'draudziņzivi',
      nameAkuDsk: 'draudziņzivis',
      price: 20,
      chance: '*',
      url: imgLinks.zivis[11],
    },
    daundizvs: {
      nameNomVsk: 'dauņzivs',
      nameNomDsk: 'dauņzivis',
      nameAkuVsk: 'dauņzivi',
      nameAkuDsk: 'dauņzivis',
      price: 20,
      chance: '*',
      url: imgLinks.zivis[11],
    },
    dizdraudzinzivs: {
      nameNomVsk: 'diždraudziņzivs',
      nameNomDsk: 'diždraudziņzivis',
      nameAkuVsk: 'diždraudziņzivi',
      nameAkuDsk: 'diždraudziņzivis',
      price: 50,
      chance: 0.2,
      url: imgLinks.zivis[11],
    },
    dizdaundizvs: {
      nameNomVsk: 'diždauņzivs',
      nameNomDsk: 'diždauņzivis',
      nameAkuVsk: 'diždauņzivi',
      nameAkuDsk: 'diždauņzivis',
      price: 50,
      chance: 0.2,
      url: imgLinks.zivis[11],
    },
    divainazivs: {
      nameNomVsk: 'dīvainā zivs',
      nameNomDsk: 'dīvainās zivis',
      nameAkuVsk: 'dīvaino zivi',
      nameAkuDsk: 'dīvainās zivis',
      price: 100,
      chance: 0.1,
      url: imgLinks.zivis[11],

    },
    juridiskazivs: {
      nameNomVsk: 'juridiskā zivs',
      nameNomDsk: 'juridiskā zivis',
      nameAkuVsk: 'juridisko zivi',
      nameAkuDsk: 'juridiskās zivis',
      price: 100,
      chance: 0.1,
      url: imgLinks.zivis[11],
      use: async message => {
        const result = await addStatus(message.guildId, message.author.id,
          { juridisks: statusList.juridisks.time })
        return `Tu apēdi juridisko zivi un sajuties juridisks\nTu esi atvieglināts no nodokļiem **${timeToText(
          result.juridisks - Date.now(), 2)}**`
      },
    },
  },
}

// defaultais laiks cik pievieno pie statusa

export const statusList = {
  aizsardziba: {
    name: 'Aizsardzība',
    time: 86400000,// 24h 86400000
  },
  bomzis: {
    name: 'Bomzis',
    time: 14400000, // 4h 14400000
  },
  laupitajs: {
    name: 'Laupītājs',
    time: 3600000, // 1h 3600000
  },
  vakcinets: {
    name: 'Vakcinēts',
    time: 43200000, // 12h 43200000
  },
  zvejotajs: {
    name: 'Zvejnieks',
    time: 86400000, // 24h 86400000
  },
  juridisks: {
    name: 'Juridiska persona',
    time: 259200000, // 72h 259200000
  },
}