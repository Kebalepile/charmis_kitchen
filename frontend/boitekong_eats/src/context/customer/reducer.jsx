import { 
  LOGIN_FORM,
   SHOW_CUSTOMER_PROFILE,
   VIEW_PROFILE } from '../types'

export default function CustomerReducer (state, action) {
  switch (action.type) {
    case VIEW_PROFILE:
      return {
        ...state,
        profile:action.payload
      }
    case LOGIN_FORM:
      return {
        ...state,
        showLoginForm: action.payload
      }
    case SHOW_CUSTOMER_PROFILE:
      return {
        ...state,
        showCustomerProfile: action.payload
      }
    default:
      return state
  }
}
