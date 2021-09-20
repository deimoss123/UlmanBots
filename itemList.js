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
  veikals: {
    mullermilch: {
      nameNomVsk: 'mullermilch',
      nameNomDsk: 'mullermilch',
      nameAkuVsk: 'mullermilch',
      nameAkuDsk: 'mullermilch',
      price: 500,
      chance: 0,
      usable: 1,
      url: 'https://i.postimg.cc/QtJ3QLXq/mullermilch.jpg'
    },
    makskere: {
      nameNomVsk: 'makšķere',
      nameNomDsk: 'makšķeres',
      nameAkuVsk: 'makšķeri',
      nameAkuDsk: 'makšķeres',
      price: 200,
      chance: 0,
      usable: 0,
      url: 'https://i.postimg.cc/B603PZG6/makskere.jpg'
    },
    nazis: {
      nameNomVsk: 'nazis',
      nameNomDsk: 'naži',
      nameAkuVsk: 'nazi',
      nameAkuDsk: 'nažus',
      price: 100,
      chance: 0,
      usable: 0,
      url: 'https://i.postimg.cc/3NrH9LNQ/nazis.jpg'
    },
    latloto: {
      nameNomVsk: 'latloto biļete',
      nameNomDsk: 'latloto biļetes',
      nameAkuVsk: 'latloto biļeti',
      nameAkuDsk: 'latloto biļetes',
      price: 50,
      chance: 0,
      usable: 1,
      url: 'https://i.postimg.cc/SK8qK233/latloto.jpg'
    },
    zemenurasens: {
      nameNomVsk: 'zemeņu Rāsēns',
      nameNomDsk: 'zemeņu Rāsēni',
      nameAkuVsk: 'zemeņu Rāsēnu',
      nameAkuDsk: 'zemeņu Rāsēnus',
      price: 50,
      chance: 0,
      usable: 1,
      url: 'https://i.postimg.cc/bYLPdjVy/zemenurasens.jpg'
    },
    virve: {
      nameNomVsk: 'virve',
      nameNomDsk: 'virves',
      nameAkuVsk: 'virvi',
      nameAkuDsk: 'virves',
      price: 10,
      chance: 0,
      usable: 1,
      url: 'https://i.postimg.cc/zvdYQnHb/virve.jpg'
    },
  },



  atkritumi: {
    zabaks: {
      nameNomVsk: 'lietots zābaks',
      nameNomDsk: 'lietoti zābaki',
      nameAkuVsk: 'lietotu zābaku',
      nameAkuDsk: 'lietotus zābakus',
      price: 10,
      chance: '*',
      usable: 0,
    },
    stiklapudele: {
      nameNomVsk: 'stikla pudele',
      nameNomDsk: 'stikla pudeles',
      nameAkuVsk: 'stikla pudeli',
      nameAkuDsk: 'stikla pudeles',
      price: 3,
      chance: '*',
      usable: 0,
    },
    plastpudele: {
      nameNomVsk: 'plastmasas pudele',
      nameNomDsk: 'plastmasas pudeles',
      nameAkuVsk: 'plastmasa pudeli',
      nameAkuDsk: 'plastmasas pudeles',
      price: 1,
      chance: '*',
      usable: 0,
    },
    metalluznis: {
      nameNomVsk: 'metāllūznis',
      nameNomDsk: 'metāllūžņi',
      nameAkuVsk: 'metāllūzni',
      nameAkuDsk: 'metāllūžņus',
      price: 2,
      chance: '*',
      usable: 0,
    },
    kartonakaste: {
      nameNomVsk: 'kartona kaste',
      nameNomDsk: 'kartona kastes',
      nameAkuVsk: 'kartona kasti',
      nameAkuDsk: 'kartona kastes',
      price: 0.5,
      chance: '*',
      usable: 0,
    },
    stiklaburka: {
      nameNomVsk: 'stikla burka',
      nameNomDsk: 'stikla burkas',
      nameAkuVsk: 'stikla burku',
      nameAkuDsk: 'stikla burkas',
      price: 3,
      chance: '*',
      usable: 0,
    },
    konservi: {
      nameNomVsk: 'tukša konservu bundža',
      nameNomDsk: 'tukšas konservu bundžas',
      nameAkuVsk: 'tukšu konservu bundžu',
      nameAkuDsk: 'tukšas konservu bundžas',
      price: 2,
      chance: '*',
      usable: 0,
    },
    plastdaksa: {
      nameNomVsk: 'plastmasas dakšiņa',
      nameNomDsk: 'plastmasas dakšiņas',
      nameAkuVsk: 'plastmasas dakšiņu',
      nameAkuDsk: 'plastmasas dakšiņas',
      price: 0.5,
      chance: '*',
      usable: 0,
    },
    maska: {
      nameNomVsk: 'sejas maska',
      nameNomDsk: 'sejas maskas',
      nameAkuVsk: 'sejas masku',
      nameAkuDsk: 'sejas maskas',
      price: 1,
      chance: '*',
      usable: 1,
    },
    avize: {
      nameNomVsk: 'avīze',
      nameNomDsk: 'avīzes',
      nameAkuVsk: 'avīzi',
      nameAkuDsk: 'avīzes',
      price: 1,
      chance: '*',
      usable: 0,
    },
    oditiscitrus: {
      nameNomVsk: 'odekolons "Citrus"',
      nameNomDsk: 'odekoloni "Citrus"',
      nameAkuVsk: 'odekolonu "Citrus"',
      nameAkuDsk: 'odekolonus "Citrus"',
      price: 10,
      chance: 0.05,
      usable: 1,
    },
    covidsertifikats: {
      nameNomVsk: 'Covid-19 sertifikāts',
      nameNomDsk: 'Covid-19 sertifikāti',
      nameAkuVsk: 'Covid-19 sertifikātu',
      nameAkuDsk: 'Covid-19 sertifikātus',
      price: 50,
      chance: 0.01,
      usable: 1,
    },
    sputnikvakc: {
      nameNomVsk: '"Sputnik V" vakcīna',
      nameNomDsk: '"Sputnik V" vakcīnas',
      nameAkuVsk: '"Sputnik V" vakcīnu',
      nameAkuDsk: '"Sputnik V" vakcīnas',
      price: 50,
      chance: 0.01,
      usable: 1,
    },
  },
}