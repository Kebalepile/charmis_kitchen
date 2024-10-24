import { LOGIN_FORM } from '../types'

export default function CustomerReducer (state, action) {
  switch (action.type) {
    case LOGIN_FORM:
      return {
        ...state,
        showLoginForm: action.payload
      }
    default:
      return state
  }
}
