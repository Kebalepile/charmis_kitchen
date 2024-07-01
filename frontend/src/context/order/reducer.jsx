import {
  SET_QUANTITY,
  SET_TOTAL,
  SET_SELECTED_SIZE,
  REST_ORDER_STATE,
  BASKET,
  BASKET_ITEMS,
  GET_ORDERS,
  UPDATE_ORDER,
  DELETE_ORDER
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
      
    case GET_ORDERS:
      return { ...state, orders: action.payload }

    case UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        )
      }

    case DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(order => order._id !== action.payload)
      }
    default:
      return state
  }
}
