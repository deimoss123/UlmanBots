// satur objektu ar tekstu uz kuru jāatbild katrā gadījumā
// text[] nosaka uz ko atbildēt un atb[] nosaka ar ko atbildēt
export const emoji = [
  // emoji saraksts jo man slinkums bija tos likt citā failā
  '<:Izbrinits:843106796083871744>',
  '<:Trola_seja:797826157226491965>',
  '<:neapmierinats:844856934732791858>',
  '<:Depresija:844857910160523274>',
  '<:velns:870010930090639361>',
  '<:Nuja:843402339581952010>',
  '<:Krutais:879085383227420692>',
  '<:kas:885188850043994123>',
  '<:Noslepumains:872937264865488966>',
  '<:876666666666666643:879090145758957588>',
]

export const emojiList = {
  muskulis: '894250303371763762',
  lenka: '894250303229153351',
  kruts: '894250303229132830',
  kas: '894250303224946728',
  kabacis: '894250303191388230',
  bacha: '894250303183020074',
  noslepumains: '894250303182999572',
  sigma: '894250303166218240',
  dizlatv: '894250303149461514',
  '1984': '894250303132696626',
  zivs: '894250303094947900',
  neapmierinats: '894250303086530560',
  velns: '894250303027810325',
  ja: '894250303006842900',
  karins: '894250302969114625',
  domajos: '894250302964895764',
  depresija: '894250302948139058',
  uldons: '894250302918783007',
  izbrinits: '894250302914592788',
  '876': '894250302889414697',
  varde: '894250302868443169',
  ulmanis: '894250302839066624',
  bedigs: '894250302830682163',
  augs: '894250302813921290',
  lejup: '894250302738419732',
  itsniks: '894250302784565279',
  nuja: '894250302633553931',
  trola: '894250302298005586',
  griezvarde: '895312716170919976',
  levits: '895312716242235422'
}


export const getEmoji = arr => {
  let res = []
  arr.map(emoji => res.push(`<:${emoji}:${emojiList[emoji]}>`))
  return res
}


// smieklīgās atbildes uz smieklīgo tekstu
export const atbildes = {

  // ulmaņa atbildes uz jautājumiem
  jaut: {
    atb: [
      'Protams, ka jā',
      'Tas pavisam noteikti ir iespējams',
      'Pašsaprotami',
      'Nav ne jausmas',
      'Neuzdod man stulbus jautājumus',
      'A kam viegli?',
      'Protams, ka nē',
      'Nezinu',
      'Tas būtu ļoti smieklīgi',
      'Netraucē man veikt apvērsumu',
      'Jautā martinsonam',
      'Jautā ambālim',
    ],
  },

  // atbildes uz kirilicas lietošanu
  kirilica: {
    atb: [
      `Šeit nav uzvaras piemineklis okupant ${emoji[2]}`,
      `Aizver muti okupant ${emoji[2]}`,
      `Krievi ${emoji[3]}`,
      `Krievija ${emoji[3]}`,
    ],
  },

  // neiesaku šito lasīt ja esi mentāli stabils cilvēks
  sieviete: {
    atb: [
      'Pieniņš\:baby_bottle:pieniņš\:milk:silts\:fire:un garšīgs\:tongue:mammīt\:girl:pabaro mani\:stuck_out_tongue:fiksi!\:tired_face:Es gribu pieniņu\:milk:no mammas pupiem!\:coconut:\:coconut:Es gribu mammas un ne citu!\:rage:Dod!\:stuck_out_tongue:Dod!\:star_struck:Dod tagad!\:heart_eyes:Dod pieniņu\:milk:tu, govs!\:cow2:Ja nedosi\:scream:Es kliegšu\:tired_face: un bļaušu!\:triumph:Īdēšu\:confounded:un čīkstēšu\:sob:un dusmošos!<:neapmierinats:844856934732791858>',
      'Sveiki kuce, jauki pupi ahahahahah pienaini pienaini pienaini bērniņi izslāpuši māmiņbērni grib pienu zīst sūkāt sūkāt sūkāt suha hahahaha stulba pizda dod man tos lielos tesmeņus tu slampa hahahaha krūtis zīle pupi man tavs alu cilvēks man izmantot lielos pupus lielai bitty Honk Honk pienains mazulis vēlas vairāk tagad Honk Honk Honk Pitter Patter uz tiem lielajiem mammām milkies hee hee hee haha haaaa haaaa nevar apturēt piena mašīnu, kas nāk caur honk honk visiem klāja pupu vilciens hee hee woop wooooooo honk honk honk',
      'Labvakar, vai es, sieviešu atbalstošs feminists, varētu saņemt no jums bildi ar vismaz vienu jūsu krūti, mana karaliene? Ja jums šķiet, ka es neesmu piemērots vīrietis un ja šis lūgums jūs traucē, lūdzu, informējiet mani. Jūs, mana karaliene, esat pelnījuši jebkura vīrieša vislielāko cieņu. Tomēr šķiet, ka daudzi no mana dzimuma seksualizē sievietes un uzskata viņas par seksa rotaļlietām. Tomēr, mana karaliene, es nepiekrītu šiem uzskatiem. Drīzāk es vērtēju sieviešu dzimumu kā augstāko, un es, cienījams vīrietis, lūdzu no jūsu ķermeņa apskatīt izolētu, vienu krūti. Es gaidu jūsu atbildi, mana karaliene.',
      'pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk',
    ],
  },

  dibens: {
    text: [
      'dibens',
      'dupsis',
      'pupi',
      'krutis'
    ],
    atb: [
      'Vai esat kādreiz redzējuši dievīgu dibenu? Kratās jūsu sirdspukstu ritmā dibenu?  Dibens, kas kaunina visus pārējos dibenus?  Tik labs dibens, kas liek atcerēties visus bēdīgos sūdus, ko darījāt jaunībā, un liek aizdomāties, kad kļuvāt par tādu neveiksminieku?  Dibens, kas ir tik labs, ka tu aizmirsti kļūt uzbudināts, jo biji satriekts par šo dibenu?  Tikko redzēju vienu.  Un ļaujiet man jums pateikt, tas bija jauks dupsis.',
      'Pupi, pupi, pupi ... tas ir viss, par ko puiši domā šajās dienās. Viņi ir idioti.  Parādiet man krūšu vīru, un es jums parādīšu bezsmadzeņu, bez klases pirkstu vilcēju, kurš neko nezina par daiļā dzimuma pārstāvi.  Es nesaprotu;  jūs nevarat izmērīt labu sievieti, vienkārši pamīcot krūtis ... ... Redziet, ja jūs esat apgaismots kā es, tad jūs zināt, ka īstais šovs ir zemāk: dibentiņš, mazulīt!  Tur tas ir!  Nekas nepārspēj aizmuguri, mans draugs.  Ikviens, kurš to neredz, ir akls vai muļķis.  Tāpēc es saku pietiek ar šo masu krūšu histēriju.  Ir pienācis laiks sakārtot lietas.  Ir pienācis laiks dot dupsim cieņu, ko tas ir pelnījis!',
      'Tās līdzības. Cilvēces attīstība. Krūšu un dibena līdzības.\n' +
      'Kad mēs gājām četrrāpus, mūsu priekšā bija viena lieta, dibens. Tad no brīža, kad cilvēce sāka staigāt uz divām kājām, mēs pārstājām redzēt dibenu mūsu sejās. Un viņu vietā pupi parādījās tieši mūsu sejās. Sievietes palielināja krūtis, lai ieņemtu dibena vietu. ORIĢINĀLAIS DZĪVES AVOTS IR DIBENS! Krūtis ir tikai aizstājējs. Krūtis nav nekas cits kā bāla dibena imitācija! Ja jūs jautātu, vai man labāk būtu kopija vai oriģināls, es ņemtu oriģinālu! Gurni un dibens norāda uz auglību! Krūtis evolūcijas procesa dēļ izvirzās uz priekšu, turot dibenu tālāk uz aizmuguri paslēptu!\n' +
      '\n' +
      'TĀPĒC ES ESMU DIBENA VĪRIETIS!',

    ]
  },

  piens: {
    text: [
      'piens',
      'pienu',
      'pienins',
      'pieninu',
      'rasens',
      'mullermilch'
    ],
    atb: [
      'Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛'
    ]
  },

  // ulmaņa atbildes kādam pieminot martinsonu
  martinsons: {
    text: [
      'martinsons',
      'lenkinsons',
      'martinsonas',
      'lenkinsonas',
    ],
    atb: [
      'martinsons kaka',
      'martisonas lenkas',
      'martinsons nemaksā nodokļus',
      '<@517429149543956480>',
    ],
  },

  // ulmaņa atbildes kādam pieminot martinsonu
  ambalis: {
    text: [
      'ambalis',
      '1984',
      'moderatori',
      'moderators',
    ],
    atb: [
      'ambālis komunists',
      'dandālis',
      'komunisms',
      'burtiski 1984',
      '1984',

    ],
  },

  olas: {
    text: [
      'sis olas',
      'olas sis',
      'olas',
      'penis',
    ],
    atb: [
      '<:izbrinits:843106796083871744> <:izbrinits:843106796083871744> <:izbrinits:843106796083871744>',
      'nu nejau ',
      'izcils humors <:izbrinits:843106796083871744>',
      'es apdirsos no smiekliem ',
      'kur nu vēl smieklīgāk',
      'jociņš spociņš',
      'mums te jokupēteris',
      'palīgā es nevaru pārstāt smieties <:izbrinits:843106796083871744>',
      'penis penis olas olas',
      'penis olas dibens olas šīs penis',
      'penis dibens dibens',
      'smird <:Trola_seja:797826157226491965>',
    ],
  },
}