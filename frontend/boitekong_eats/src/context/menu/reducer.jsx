import {
  DIKUKU_MENU,
  MAGWINYA_MENU,
  PIZZA_MENU,
  CHICKEN_MENU,
  COMPLETE_MENU,
  CHIPS_MENU,
  MENU,
  OPEN_MENU
} from '../types'

export default function Reducer (state, action) {
  switch (action.type) {
    case OPEN_MENU:
    case MENU:
      return { ...state, ...action.payload }

    case CHIPS_MENU:
    case PIZZA_MENU:
    case CHICKEN_MENU:
    case COMPLETE_MENU:
    case DIKUKU_MENU:
    case MAGWINYA_MENU:
    default:
      return state
  }
}
