export const updateFish = f => {
  let fishing = {...f}
  const currentTime = Date.now()

  // pārbauda vai ir nākotnes zivis
  if (Object.keys(fishing.fish)) {
    if (fishing.fishCount >= fishing.fishLimit) {
      fishing.fish = {}

      // pārbauda vai pirmajai zivij laiks ir mazāks par tagadējo
    } else  {
      // pārbauda visām zivīm laiku
      for (const fish of Object.keys(fishing.fish)) {
        const fishName = fishing.fish[fish].fishedItem
        if (currentTime > fish) {

          let item = {}
          item[fishName] = 1
          fishing.lastCatch = { time: parseInt(fish), item }

          fishing.rodUsesLeft = fishing.fish[fish].usesLeft

          fishing.coughtFish[fishName] = !fishing.coughtFish[fishName] ? 1 : fishing.coughtFish[fishName] + 1
          delete fishing.fish[fish]

          if (++fishing.fishCount >= fishing.fishLimit) {
            fishing.fish = {}
            break
          }

        } else break
      }

    }
  }

  return fishing
}