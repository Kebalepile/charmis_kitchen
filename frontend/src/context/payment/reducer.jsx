import {
  PAYMENT,
  ORDER_PUNCHED,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  SET_TOTAL
} from '../types'

export default function PaymenReducer (state, action) {
  switch (action.type) {
    case SET_TOTAL:
      return {
        ...state,
        total: action.payload
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
    case PAYMENT:
    case ORDER_PUNCHED:
    default:
      return state
  }
}
