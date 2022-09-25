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
  udenszive: 'a1023702584986439762',
  cope1: 'a920842349339353098',
  cope2: 'a920842349821706260',
  zive: 'a920844107583221782',

  lats: '911400812754915388',
  muskulis: '894250303371763762',
  lenka: '894250303229153351',
  kruts: '894250303229132830',
  kas: '894250303224946728',
  kabacis: '894250303191388230',
  bacha: '894250303183020074',
  noslepumains: '894250303182999572',
  sigma: '894250303166218240',
  dizlatv: '894250303149461514',
  1984: '894250303132696626',
  zivs: '894250303094947900',
  neapmierinats: '894250303086530560',
  velns: '894250303027810325',
  ja: '894250303006842900',
  karins: '894250302969114625',
  domajos: '894250302964895764',
  depresija: '894250302948139058',
  uldons: '894250302918783007',
  izbrinits: '894250302914592788',
  876: '894250302889414697',
  varde: '894250302868443169',
  ulmanis: '894250302839066624',
  bedigs: '894250302830682163',
  augs: '894250302813921290',
  lejup: '894250302738419732',
  itsniks: '894250302784565279',
  nuja: '1013532414032756747',
  trola: '894250302298005586',
  griezvarde: 'a895312716170919976',
  levits: 'a895312716242235422',
  petnieks: 'a911599720928002059',
  fenka1: 'a917087131128700988',

  _dizloto: '922498308210032690',
  _etalons: '922498308587524137',
  _kartonakaste: '922498308843397161',
  _konservi: '922498308650438656',
  _latloto: '922498308671414272',
  _makskere: '922501148974383204',
  _divainamakskere: 'a927027121845567488',
  _mullermilch: '922498309053091943',
  _nazis: '922501148806615071',
  _oditiscitrus: '922501149070880818',
  _sputnikvakc: '922501450456793189',
  _stiklapudele: '922501149192515584',
  _virve: '922501450544857098',
  _zemenurasens: '922498308537192470',
  _zabaks: '922498308595929178',
  _whatsapp: 'a927212180661764179',
  _smiekligaisburkans: 'a937087454513598474',
  _cigaretes: '1011007876833235034',

  _draudzinzivs: '922507454741381190',
  _daundizvs: '922507454842019870',
  _dizdaundizvs: '922510373775609886',
  _dizdraudzinzivs: '922510361549230081',
  _juridiskazivs: '927210107803164672',
  _divainazivs: 'a927210108654587905',
}

export const getEmoji = (arr) => {
  return arr.map((emoji) => {
    if (!emojiList[emoji]) return ''

    if (emojiList[emoji].startsWith('a'))
      return `<a:${emoji}:${emojiList[emoji].substr(1)}>`
    return `<:${emoji}:${emojiList[emoji]}>`
  })
}

// smieklīgās atbildes uz smieklīgo tekstu
export const atbildes = {
  // ulmaņa atbildes uz jautājumiem
  jaut: {
    atb: [
      'Protams, ka jā',
      'Tas pavisam noteikti ir iespējams',
      'Pašsaprotami',
      'Neuzdod man stulbus jautājumus',
      'A kam viegli?',
      'Protams, ka nē',
      'Tas būtu ļoti smieklīgi',
      'Netraucē man veikt apvērsumu',
      'Balstīts jautājums',
      'Galīgi nav balstīts jautājums',
      'Es ienīstu krievus',
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
      'Pieniņš:baby_bottle:pieniņš:milk:silts:fire:un garšīgs:tongue:mammīt:girl:pabaro mani:stuck_out_tongue:fiksi!:tired_face:Es gribu pieniņu:milk:no mammas pupiem!:coconut::coconut:Es gribu mammas un ne citu!:rage:Dod!:stuck_out_tongue:Dod!:star_struck:Dod tagad!:heart_eyes:Dod pieniņu:milk:tu, govs!:cow2:Ja nedosi:scream:Es kliegšu:tired_face: un bļaušu!:triumph:Īdēšu:confounded:un čīkstēšu:sob:un dusmošos!<:neapmierinats:844856934732791858>',
      'Sveiki kuce, jauki pupi ahahahahah pienaini pienaini pienaini bērniņi izslāpuši māmiņbērni grib pienu zīst sūkāt sūkāt sūkāt suha hahahaha stulba pizda dod man tos lielos tesmeņus tu slampa hahahaha krūtis zīle pupi man tavs alu cilvēks man izmantot lielos pupus lielai bitty Honk Honk pienains mazulis vēlas vairāk tagad Honk Honk Honk Pitter Patter uz tiem lielajiem mammām milkies hee hee hee haha haaaa haaaa nevar apturēt piena mašīnu, kas nāk caur honk honk visiem klāja pupu vilciens hee hee woop wooooooo honk honk honk',
      'Labvakar, vai es, sieviešu atbalstošs feminists, varētu saņemt no jums bildi ar vismaz vienu jūsu krūti, mana karaliene? Ja jums šķiet, ka es neesmu piemērots vīrietis un ja šis lūgums jūs traucē, lūdzu, informējiet mani. Jūs, mana karaliene, esat pelnījuši jebkura vīrieša vislielāko cieņu. Tomēr šķiet, ka daudzi no mana dzimuma seksualizē sievietes un uzskata viņas par seksa rotaļlietām. Tomēr, mana karaliene, es nepiekrītu šiem uzskatiem. Drīzāk es vērtēju sieviešu dzimumu kā augstāko, un es, cienījams vīrietis, lūdzu no jūsu ķermeņa apskatīt izolētu, vienu krūti. Es gaidu jūsu atbildi, mana karaliene.',
      'pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk pupu vilciens hee hee woop wooooooo honk honk honk',
      'Sveika, dārgā! Ļoti priecājos, ka esam draugi! Paldies par piedāvājumu, bet Tevi labākajā gadījumā var novērtēt kā septiņnieku desmit baļļu skalā. Es pats esmu daudz skaistāks, tāpēc neuzskatu, ka man ir jēga "čatot" ar Tevi, jo to es daru vien ar tiem, kas ģenētiski ir manā līmenī, lai nodotu stiprus un skaistus gēnus maniem bērniem. Baidos, ka mūsu bērnus Tu novilktu par diviem punktiem uz leju. Skatoties pēc tavas riskantās profilbildes un spējas šķietami bez jēgas rakstīt šķietami nejauši izraudzītiem večiem, iespēja, ka Tu esi mauka, ir gana liela. Paldies, ka pievienoji manu profilu, ceru ka kļūsim par labiem draugiem!',
    ],
  },

  dibens: {
    text: ['dibens', 'dupsis', 'pupi', 'krutis'],
    atb: [
      'Vai esat kādreiz redzējuši dievīgu dibenu? Kratās jūsu sirdspukstu ritmā dibenu?  Dibens, kas kaunina visus pārējos dibenus?  Tik labs dibens, kas liek atcerēties visus bēdīgos sūdus, ko darījāt jaunībā, un liek aizdomāties, kad kļuvāt par tādu neveiksminieku?  Dibens, kas ir tik labs, ka tu aizmirsti kļūt uzbudināts, jo biji satriekts par šo dibenu?  Tikko redzēju vienu.  Un ļaujiet man jums pateikt, tas bija jauks dupsis.',
      'Pupi, pupi, pupi ... tas ir viss, par ko puiši domā šajās dienās. Viņi ir idioti.  Parādiet man krūšu vīru, un es jums parādīšu bezsmadzeņu, bez klases pirkstu vilcēju, kurš neko nezina par daiļā dzimuma pārstāvi.  Es nesaprotu;  jūs nevarat izmērīt labu sievieti, vienkārši pamīcot krūtis ... ... Redziet, ja jūs esat apgaismots kā es, tad jūs zināt, ka īstais šovs ir zemāk: dibentiņš, mazulīt!  Tur tas ir!  Nekas nepārspēj aizmuguri, mans draugs.  Ikviens, kurš to neredz, ir akls vai muļķis.  Tāpēc es saku pietiek ar šo masu krūšu histēriju.  Ir pienācis laiks sakārtot lietas.  Ir pienācis laiks dot dupsim cieņu, ko tas ir pelnījis!',
      'Tās līdzības. Cilvēces attīstība. Krūšu un dibena līdzības.\n' +
        'Kad mēs gājām četrrāpus, mūsu priekšā bija viena lieta, dibens. Tad no brīža, kad cilvēce sāka staigāt uz divām kājām, mēs pārstājām redzēt dibenu mūsu sejās. Un viņu vietā pupi parādījās tieši mūsu sejās. Sievietes palielināja krūtis, lai ieņemtu dibena vietu. ORIĢINĀLAIS DZĪVES AVOTS IR DIBENS! Krūtis ir tikai aizstājējs. Krūtis nav nekas cits kā bāla dibena imitācija! Ja jūs jautātu, vai man labāk būtu kopija vai oriģināls, es ņemtu oriģinālu! Gurni un dibens norāda uz auglību! Krūtis evolūcijas procesa dēļ izvirzās uz priekšu, turot dibenu tālāk uz aizmuguri paslēptu!\n' +
        '\n' +
        'TĀPĒC ES ESMU DIBENA VĪRIETIS!',
    ],
  },

  piens: {
    text: ['piens', 'pienu', 'pienins', 'pieninu', 'rasens', 'mullermilch'],
    atb: [
      'Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛Pieniņš🍼pieniņš🥛',
      'Sāksim ar to, ka sākumā jāsaprot, kas tad īsti ir piens. Te runa nav par veikala pasterizēto "pienu". Tas NAV piens. Piens satur ne tikai to balto šļuru, kas saķep kopā rūgulī, bet arī visas jaukās baktērijas, kas pasterizācijas procesā vienkārši iznīkst. Piens ir biosfēra. Katrai gotiņai ir sava piena struktūra. Protams, es atbalstu Latvijas Brūnas gotiņas nevis kaut kādus Vācijas vatusus. Latvijas Brūnās ir pielāgotas tieši Latvijas klimatam. Tās te ir dzīvojušas gadsimtiem ilgi. Pie reizes latvieši ir pieraduši pie svaigi slaukta Latvijas Brūno gotiņu piena nevis pie kaut kāda Polijas pasterizētā "piena". Ko Jūs vispār dzerat? Vai tas maz vēl ir piens? Vai sajaukts piena pulveris Jums arī būtu piens? Piens nāk no zīdītāja nevis no katla. Es personīgi visu laiku savu pienu pērku no lauciniekiem, kas atbrauc uz Rīgu vienā stāvlaukumā trešdienu un sestdienu pēcpusdienās. Es zinu, ko es pērku. Es zinu, ko es dzeru. Jā, piens sabojājas pēc 2-5 dienām. Tā tam vajadzētu būt. Es dzeru īstu pienu, atbalstu Latvijas biznesu, nemoku ārzemju gotiņas lielajās slauktuvēs, atkārtoti izmantoju piena kanniņu, jo piens ir izlejams, un maksāju tikai 80 centus litrā. Es te skatos, kā mana mazā māsa no skolas atnes mājās skolā dalītās piena paciņas - viņa noliek ledusskapī, a piens nostāv pusgadu, un nekas nenotiek. Jūs ko gribat teikt, ka tas ir kaut kas veselīgs? Ka tas ir kaut kas dzīvs? Kaut kas bioloģisks? Varēji vitamīnus rīt nevis mānīt sevi ar veselīgu uzturu. Bet, nē - tūlīt kāds jau rakstīs: "Valt, ko tu pīpē?" Ko Jūs pīpējat? Jums makdonalda burgerītis arī skaitās veselīgs ēdiens? Siers nekad nesabojājas - tur pat nekas nevar iedzīvoties. Labi, jā, es par visu šo pārspīlēju, bet padomājiet tak, ko Jūs ēdat. Vai tas maz ir kaut kas ēdams? Jā, cauri ķermenim iziet, bet vai pie šāda dzīves stila mūsu ķermeņi ir gadu tūkstošos pieraduši? Centīsimies tomēr būt prātīgi un veselīgi un nepārtikt tikai no pārstrādātiem produktiem.',
    ],
  },

  // ulmaņa atbildes kādam pieminot martinsonu
  martinsons: {
    text: ['martinsons', 'lenkinsons', 'martinsonas', 'lenkinsonas'],
    atb: [
      'martinsons kaka',
      'martisonas lenkas',
      'martinsons nemaksā nodokļus',
      '<@517429149543956480>',
    ],
  },

  // ulmaņa atbildes kādam pieminot martinsonu
  ambalis: {
    text: ['ambalis', '1984', 'moderatori', 'moderators'],
    atb: [
      'ambālis komunists',
      'dandālis',
      'komunisms',
      'burtiski 1984',
      '1984',
    ],
  },

  olas: {
    text: ['sis olas', 'olas sis', 'olas', 'penis'],
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

  reiz: {
    text: ['reiz', 'bunkurs'],
    atb: [
      'Reiz bija bunkurs trīspadsmit, kur veči dzīvoja. Kad granātu tur iemeta, tad sūdi pajuka.',
    ],
  },
}
