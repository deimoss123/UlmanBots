import { pozicijasLat } from './rulEmbeds.js'

export const rulComponents = (rand, pos, likme, enabled = false) => {
  let disabled = true
  let style = 2

  if (enabled) {
    disabled = false
    style = 1
  }

  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style,
          label: `Griezt vēlreiz (${isNaN(pos) ? pozicijasLat[pos] : pos}) (likme: ${likme})`,
          custom_id: `grieztVelreiz ${rand}`,
          disabled,
        },
      ],
    },
  ]
}