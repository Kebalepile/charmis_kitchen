import {
  SET_QUANTITY,
  SET_TOTAL,
  SET_SELECTED_SIZE,
  REST_ORDER_STATE,
  BASKET,
  BASKET_ITEMS
} from '../types'

export default function orderReducer (state, action) {
  switch (action.type) {
    case BASKET:
      return {
        ...state,
        basket: action.payload
      }
    case BASKET_ITEMS:
      return {
        ...state,
        basketItems: action.payload
      }
    case SET_QUANTITY:
      return {
        ...state,
        quantity: action.payload
      }

    case SET_TOTAL:
      return {
        ...state,
        total: action.payload
      }
    case SET_SELECTED_SIZE:
      return {
        ...state,
        selectedSize: action.payload
      }
    case REST_ORDER_STATE:
      return { ...action.payload }
    default:
      return state
  }
}
