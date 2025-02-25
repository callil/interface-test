import { keyframes, style } from '@vanilla-extract/css'
import { darken } from 'polished'

import { sprinkles } from './sprinkles.css'

const loadingAnimation = keyframes({
  '0%': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0% 50%',
  },
})

export const loadingBlock = style([
  {
    animation: `${loadingAnimation} 1.5s infinite`,
    animationFillMode: 'both',
    background: `linear-gradient(to left, #2222220d 25%, ${darken(0.8, '#2222220d')} 50%, #2222220d 75%)`,
    backgroundSize: '400%',
    willChange: 'background-position',
  },
])

export const loadingAsset = style([
  loadingBlock,
  sprinkles({
    borderRadius: '12',
    cursor: 'default',
    color: 'transparent',
  }),
  {
    userSelect: 'none',
  },
])
