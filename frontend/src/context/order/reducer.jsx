import {
  SET_QUANTITY,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  SET_TOTAL,
  SET_SELECTED_SIZE,
  REST_ORDER_STATE,
  BASKET,
  BASKET_ITEMS
} from '../types'

export default function orderReducer(state, action) {
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
    case SET_NAME:
      return {
        ...state,
        name: action.payload
      }
    case SET_PHONE:
      return {
        ...state,
        phone: action.payload
      }
    case SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload
      }
    case SET_DELIVERY_CHARGE:
      return {
        ...state,
        deliveryCharge: action.payload
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
