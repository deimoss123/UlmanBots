import { generateSlotiRow } from './generateSlotiRow.js'

export const testLaimesti = (laimesti, times) => {
  const totalTimes = times
  let totalmultiplier = 0
  while (--times >= 0) {
    const res = generateSlotiRow(5, laimesti)

    let multiplier = 0
    res.arr.map(reiz => {
      if (laimesti[reiz].multiplier) multiplier += laimesti[reiz].multiplier
    })
    totalmultiplier += multiplier
  }

  console.log(totalmultiplier / totalTimes)
}

export const laimesti = {
  fenkaSloti: {
    varde: {
      chance: '*',
    },
    depresija: {
      chance: '*',
    },
    lenka: {
      chance: '*',
    },
    zivs: {
      chance: 0.07,
      multiplier: 0.05
    },
    nuja: {
      chance: 0.05,
      multiplier: 0.1
    },
    muskulis: {
      chance: 0.04,
      multiplier: 0.2
    },
    bacha: {
      chance: 0.035,
      multiplier: 0.5
    },
    izbrinits: {
      chance: 0.03,
      multiplier: 1
    },
    kabacis: {
      chance: 0.02,
      multiplier: 3
    },
    ulmanis: {
      chance: 0.01,
      multiplier: 5
    },
    petnieks: {
      chance: 0.005,
      minMultiplier: 8,
      maxMultiplier: 12
    }
  }
}