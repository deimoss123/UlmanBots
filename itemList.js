import { addLati, addStatus, findUser } from './ekonomija.js'
import { chance, latsOrLati, timeToText } from './helperFunctions.js'

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

const floorTwo = (num) => {
  return Math.floor(num * 100) / 100
}

export const itemList = {
  // preces kas nopērkamas veikalā
  veikals: {
    smiekligaisburkans: {
      ids: ['burkans', 'burkanu'],
      nameNomVsk: 'burkāns',
      nameNomDsk: 'burkāni',
      nameAkuVsk: 'burkānu',
      nameAkuDsk: 'burkānus',
      price: 5000,
      chance: 0,
      url: '',
      notRemovedOnUse: true,
      use: async () => 'Tu nokodies burkānu, **mmmm** bija garšīgs',
    },
    divainamakskere: {
      ids: ['divainamakskere', 'divainomakskeri'],
      nameNomVsk: 'dīvainā makšķere',
      nameNomDsk: 'dīvainā makšķeres',
      nameAkuVsk: 'dīvainā makšķeri',
      nameAkuDsk: 'dīvainā makšķeres',
      price: 500,
      chance: 0,
      url: 'https://i.postimg.cc/B603PZG6/makskere.jpg',
      notRemovedOnUse: true,
      use: async () => 'Lai izmantotu makšķeri lieto komandu `.zvejot`',
    },
    mullermilch: {
      ids: ['mullermilch', 'muller', 'mullerpiens'],
      nameNomVsk: 'mullermilch',
      nameNomDsk: 'mullermilch',
      nameAkuVsk: 'mullermilch',
      nameAkuDsk: 'mullermilch',
      price: 450,
      chance: 0.01,
      url: 'https://i.postimg.cc/QtJ3QLXq/mullermilch.jpg',
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id, {
          aizsardziba: statusList.aizsardziba.time,
        })
        return `Tu izdzēri mullermilch, tavi kauli palika daudz stiprāki\nTu esi aizsargāts no zagšanas **${timeToText(
          result.aizsardziba - Date.now(),
          2
        )}**`
      },
    },
    dizloto: {
      ids: ['dizloto'],
      nameNomVsk: 'dižloto biļete',
      nameNomDsk: 'dižloto biļetes',
      nameAkuVsk: 'dižloto biļeti',
      nameAkuDsk: 'dižloto biļetes',
      disableDiscount: true,
      price: 150,
      chance: 0,
      url: 'https://i.postimg.cc/SK8qK233/latloto.jpg',
      use: async (message) => {
        const laimesti = {
          massive: {
            name: 'milzīgo',
            chance: 0.01,
            reward: 4000,
          },
          big: {
            name: 'lielo',
            chance: 0.1,
            reward: 800,
          },
          mid: {
            name: 'vidējo',
            chance: 0.2,
            reward: 400,
          },
          small: {
            name: 'mazo',
            chance: 0.45,
            reward: 175,
          },
          nothing: {
            name: 'neko',
            chance: '*',
            reward: 0,
          },
        }
        const res = chance(laimesti)

        if (laimesti[res].name !== 'neko') {
          await addLati(
            message.guildId,
            message.author.id,
            laimesti[res].reward
          )
          return `Tu vinnēji ${laimesti[res].name} laimestu - **${laimesti[res].reward}** latus`
        } else {
          return `Tu neko nevinnēji :(`
        }
      },
    },
    nazis: {
      ids: ['nazis', 'nazi'],
      nameNomVsk: 'nazis',
      nameNomDsk: 'naži',
      nameAkuVsk: 'nazi',
      nameAkuDsk: 'nažus',
      price: 125,
      chance: 0.05,
      url: 'https://i.postimg.cc/3NrH9LNQ/nazis.jpg',
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id, {
          laupitajs: statusList.laupitajs.time,
        })
        return (
          `Tu izvilki nazi un agresīvi sāki skatīties uz garāmgājējiem\n` +
          `Tavai zagšanai ir palielināta efektivitāte **${timeToText(
            result.laupitajs - Date.now(),
            2
          )}**`
        )
      },
    },
    makskere: {
      ids: ['kokamakskere', 'kokamakskeri'],
      nameNomVsk: 'koka makšķere',
      nameNomDsk: 'koka makšķeres',
      nameAkuVsk: 'koka makšķeri',
      nameAkuDsk: 'koka makšķeres',
      price: 100,
      chance: 0,
      url: 'https://i.postimg.cc/B603PZG6/makskere.jpg',
      notRemovedOnUse: true,
      use: async () => 'Lai izmantotu makšķeri lieto komandu `.zvejot`',
    },
    zemenurasens: {
      ids: ['rasens', 'zemenurasens', 'rasenu', 'zemenurasenu'],
      nameNomVsk: 'zemeņu Rasēns',
      nameNomDsk: 'zemeņu Rasēni',
      nameAkuVsk: 'zemeņu Rasēnu',
      nameAkuDsk: 'zemeņu Rasēnus',
      price: 75,
      chance: '*',
      url: 'https://i.postimg.cc/bYLPdjVy/zemenurasens.jpg',
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id, {
          aizsardziba: 3600000,
        })
        return (
          `Tu izdzēri zemeņu Rāsēnu, tavi kauli palika nedaudz stiprāki\n` +
          `Tu esi aizsargāts no zagšanas **${timeToText(
            result.aizsardziba - Date.now(),
            2
          )}**`
        )
      },
    },
    latloto: {
      ids: ['latloto'],
      nameNomVsk: 'latloto biļete',
      nameNomDsk: 'latloto biļetes',
      nameAkuVsk: 'latloto biļeti',
      nameAkuDsk: 'latloto biļetes',
      price: 50,
      disableDiscount: true,
      chance: '*',
      url: 'https://i.postimg.cc/SK8qK233/latloto.jpg',
      use: async (message) => {
        const laimesti = {
          massive: {
            name: 'milzīgo',
            chance: 0.01,
            reward: 1000,
          },
          big: {
            name: 'lielo',
            chance: 0.1,
            reward: 250,
          },
          mid: {
            name: 'vidējo',
            chance: 0.25,
            reward: 120,
          },
          small: {
            name: 'mazo',
            chance: 0.5,
            reward: 50,
          },
          nothing: {
            name: 'neko',
            chance: '*',
            reward: 0,
          },
        }
        const res = chance(laimesti)

        if (laimesti[res].name !== 'neko') {
          await addLati(
            message.guildId,
            message.author.id,
            laimesti[res].reward
          )
          return `Tu vinnēji ${laimesti[res].name} laimestu - **${laimesti[res].reward}** latus`
        } else {
          return `Tu neko nevinnēji :(`
        }
      },
    },
    cigaretes: {
      ids: ['cigaretes', 'cigarete', 'cigateti', 'cigas', 'ciga', 'cigu'],
      nameNomVsk: 'WhatsApp cigaretes',
      nameNomDsk: 'Whatsapp cigaretes',
      nameAkuVsk: 'Whatsapp cigaretes',
      nameAkuDsk: 'WhatsApp cigaretes',
      price: 35,
      chance: 0,
      url: '',
      use: async (message) => {
        const max = 100
        const min = 50

        const lati = Math.floor((Math.random() * (max - min) + min) * 100) / 100
        await addLati(message.guildId, message.author.id, -lati)
        return (
          'Tu izkurīji cīgu un dabūji plaušu vēzi\n' +
          `Slimnīcas rēķins: **${lati}** lati`
        )
      },
    },
    virve: {
      ids: ['virve', 'pasnaviba', 'virvi', 'pasnavibu'],
      nameNomVsk: 'virve',
      nameNomDsk: 'virves',
      nameAkuVsk: 'virvi',
      nameAkuDsk: 'virves',
      price: 10,
      chance: '*',
      url: 'https://i.postimg.cc/zvdYQnHb/virve.jpg',
      use: async (message) => {
        const { lati } = await findUser(message.guildId, message.author.id)
        if (lati < 0)
          return `Tu nevari pakārties, tev ir nesamaksāts parāds ${floorTwo(
            lati * -1
          ).toFixed(2)} latu apmērā`
        await addLati(message.guildId, message.author.id, lati * -1)
        return `Tu pakāries un pazaudēji visu savu naudu`
      },
    },
  },

  // atkritumi, iegūstami no bomžošanas
  atkritumi: {
    etalons: {
      ids: ['etalons', 'e-talons', 'etalonu', 'e-talonu'],
      nameNomVsk: 'e-talons',
      nameNomDsk: 'e-taloni',
      nameAkuVsk: 'e-talonu',
      nameAkuDsk: 'e-talonus',
      description: 'atkr',
      price: 3,
      chance: '*',
    },
    zabaks: {
      ids: ['zabaks', 'zabaku'],
      nameNomVsk: 'lietots zābaks',
      nameNomDsk: 'lietoti zābaki',
      nameAkuVsk: 'lietotu zābaku',
      nameAkuDsk: 'lietotus zābakus',
      description: 'atkr',
      price: 4,
      chance: '*',
    },
    stiklapudele: {
      ids: ['pudele', 'pudeli'],
      nameNomVsk: 'stikla pudele',
      nameNomDsk: 'stikla pudeles',
      nameAkuVsk: 'stikla pudeli',
      nameAkuDsk: 'stikla pudeles',
      description: 'atkr',
      price: 3,
      chance: '*',
    },
    konservi: {
      ids: ['konservi', 'konservus'],
      nameNomVsk: 'konservu bundža',
      nameNomDsk: 'konservu bundžas',
      nameAkuVsk: 'konservu bundžu',
      nameAkuDsk: 'konservu bundžas',
      description: 'atkr',
      price: 3,
      chance: '*',
    },

    kartonakaste: {
      ids: ['kaste', 'kartonakaste', 'kasti'],
      nameNomVsk: 'kartona kaste',
      nameNomDsk: 'kartona kastes',
      nameAkuVsk: 'kartona kasti',
      nameAkuDsk: 'kartona kastes',
      description: 'atkr',
      price: 4,
      chance: '*',
    },

    oditiscitrus: {
      ids: [
        'citrus',
        'odekolons',
        'odekolonscitrus',
        'oditis',
        'odekolonu',
        'citrusu',
      ],
      nameNomVsk: 'odekolons "Citrus"',
      nameNomDsk: 'odekoloni "Citrus"',
      nameAkuVsk: 'odekolonu "Citrus"',
      nameAkuDsk: 'odekolonus "Citrus"',
      price: 5,
      chance: 0.1,
      notRemovedOnUse: true,
      use: async (message) => {
        return (
          'Odekolonu var izmantot lai iegūtu papildus bomžošanas reizes ' +
          'vai pārdot bomžojot izmantojot pogu `Tirgot odekolonu "Citrus"`'
        )
      },
    },
    sputnikvakc: {
      ids: ['vakcina', 'sputnik', 'sputnikvakcina', 'vakcinu'],
      nameNomVsk: '"Sputnik V" vakcīna',
      nameNomDsk: '"Sputnik V" vakcīnas',
      nameAkuVsk: '"Sputnik V" vakcīnu',
      nameAkuDsk: '"Sputnik V" vakcīnas',
      price: 20,
      chance: 0.1,
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id, {
          vakcinets: statusList.vakcinets.time,
        })
        return `Tu sev iedūri okupantu šļirci un kļuvi vakcinēts\nTu vari strādāt veikalā **${timeToText(
          result.vakcinets - Date.now(),
          2
        )}**`
      },
    },
    whatsapp: {
      // nozog visu bankas naudu
      ids: [
        'whatsapp',
        'odekolonswhatsapp',
        'vacapaoditis',
        'vacaps',
        'oditisvacap',
        'oditiswhatsapp',
        'vacapu',
      ],
      nameNomVsk: 'odekolons "Whatsapp"',
      nameNomDsk: 'odekoloni "Whatsapp"',
      nameAkuVsk: 'odekolonu "Whatsapp"',
      nameAkuDsk: 'odekolonus "Whatsapp"',
      price: 100,
      chance: 0.005,
      use: async (message) => {
        const { guildId } = message
        const userId = message.author.id

        const { lati } = await findUser(guildId, userId)

        // bota lati
        const banka = await findUser(message.guildId, process.env.ULMANISID)

        let stolen = banka.lati
        if (stolen > 3000) stolen = 3000

        const txt =
          `Tu izdzēri vacapa odīti un apštirījies no bankas nozagi **${floorTwo(
            stolen
          ).toFixed(2)}** latus\n` +
          `Tev tagad ir **${floorTwo(lati + stolen).toFixed(2)}** lati`

        await addLati(guildId, userId, stolen)
        await addLati(guildId, process.env.ULMANISID, stolen * -1)

        return txt
      },
    },
  },
  zivis: {
    draudzinzivs: {
      ids: ['draudzinzivs', 'draudzinzivi'],
      nameNomVsk: 'draudziņZivs',
      nameNomDsk: 'draudziņZivis',
      nameAkuVsk: 'draudziņZivi',
      nameAkuDsk: 'draudziņZivis',
      description: 'zivs',
      price: 20,
    },
    daundizvs: {
      ids: ['daunzivs', 'daunzivi'],
      nameNomVsk: 'dauņZivs',
      nameNomDsk: 'dauņZivis',
      nameAkuVsk: 'dauņZivi',
      nameAkuDsk: 'dauņZivis',
      description: 'zivs',
      price: 20,
    },
    dizdraudzinzivs: {
      ids: ['dizdraudzinzivs', 'dizdraudzinzivi'],
      nameNomVsk: 'dižDraudziņZivs',
      nameNomDsk: 'dižDraudziņZivis',
      nameAkuVsk: 'dižDraudziņZivi',
      nameAkuDsk: 'dižDraudziņZivis',
      description: 'zivs',
      price: 40,
    },
    dizdaundizvs: {
      ids: ['dizdaunzivs', 'dizdaunzivi'],
      nameNomVsk: 'dižDauņZivs',
      nameNomDsk: 'dižDauņZivis',
      nameAkuVsk: 'dižDauņZivi',
      nameAkuDsk: 'dižDauņZivis',
      description: 'zivs',
      price: 40,
    },
    divainazivs: {
      ids: ['divainazivs', 'divainozivi', 'divaina'],
      nameNomVsk: 'dīvainā zivs',
      nameNomDsk: 'dīvainās zivis',
      nameAkuVsk: 'dīvaino zivi',
      nameAkuDsk: 'dīvainās zivis',
      description:
        'Šī zivs iedod nejauši izvēlētu statusu to apēdot (izmantojot)',
      price: 80,
      use: async (message) => {
        let st = {}
        const statusName =
          Object.keys(statusList)[
            Math.floor(Math.random() * Object.keys(statusList).length)
          ]
        const status = statusList[statusName]
        st[statusName] = status.time / 2
        const result = await addStatus(message.guildId, message.author.id, st)
        return (
          `Tu apēdi dīvaino zivi un nejauši ieguvi "${status.name.toLowerCase()}" statusu\n` +
          `Tu tagad esi ${status.name.toLowerCase()} **${timeToText(
            result[statusName] - Date.now(),
            2
          )}**`
        )
      },
    },
    juridiskazivs: {
      ids: ['juridiskazivs', 'juridiskozivi'],
      nameNomVsk: 'juridiskā zivs',
      nameNomDsk: 'juridiskās zivis',
      nameAkuVsk: 'juridisko zivi',
      nameAkuDsk: 'juridiskās zivis',
      description:
        'Apēdot (izmantojot) juridisko zivi tu iegūsti "Juridiska persona" statusu uz 7 dienām\n' +
        'Ar "Juridiska persona" statusu tev nav jāmaksā nodokļi pārskaitot naudu citiem lietotājiem',
      price: 80,
      use: async (message) => {
        const result = await addStatus(message.guildId, message.author.id, {
          juridisks: statusList.juridisks.time,
        })
        return `Tu apēdi juridisko zivi un sajuties juridisks\nTu esi atvieglināts no nodokļiem **${timeToText(
          result.juridisks - Date.now(),
          2
        )}**`
      },
    },
  },
}

// defaultais laiks cik pievieno pie statusa

export const statusList = {
  aizsardziba: {
    name: 'Aizsargāts',
    description:
      'Aizsardzība pret zagšanu. ' +
      'Statusu iespējams iegūt no Mullermilch - **24h** un zemeņu rāsēna - **1h**. ' +
      'Abus var nopirkt veikalā (`.veikals`)',
    time: 86400000, // 24h 86400000
  },
  laupitajs: {
    name: 'Laupītājs',
    description:
      'Palielināti zagšanas procenti. ' +
      'Statusu var iegūt no naža - **1h**, kas nopērkams veikalā (`.veikals`). ' +
      'Zagšanas procentus var apskatīt ar komandu `.zagt`',
    time: 3600000, // 1h 3600000
  },
  vakcinets: {
    name: 'Vakcinēts',
    description:
      'Ļauj strādāt veikalā (`.strādāt`). ' +
      'Statusu iegūst no "Sputnik V" vakcīnas - **36h**' +
      'Vakcīnu var iegūt no bomžošanas (meklēt atkritumus)',
    time: 43200000, // 36h 43200000
  },
  juridisks: {
    name: 'Juridiska persona',
    description:
      'Kļūsti par juridisku personu un nemaksā naudas pārskaitīšanas nodokli. ' +
      'Statusu iegūst no juridiskās zivs - **7d**, kuru var nozvejot (`.zvejot`)',
    time: 604800000, // 7d
  },
}
