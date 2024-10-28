import React, { useReducer } from 'react'
import CustomerContext from './context'
import CustomerReducer from './reducer'
import PropTypes from 'prop-types'

import {
  ServerDomain,
  LOGIN_FORM,
  SHOW_CUSTOMER_PROFILE,
  VIEW_PROFILE
} from '../types'

function CustomerProvider ({ children }) {
  const initialState = {
    showLoginForm: false,
    showCustomerProfile: false,
    profile: false
  }
  const [state, dispatch] = useReducer(CustomerReducer, initialState)
  const { showLoginForm, showCustomerProfile, profile } = state
  const ToggleLoginForm = () => {
    dispatch({ type: LOGIN_FORM, payload: !showLoginForm })
  }
  const addToLocalStorage = (name, data) =>
    localStorage.setItem(name, JSON.stringify(data))

  const getLocalStorage = name => JSON.parse(localStorage.getItem(name))

  const cleanData = (type, data) => {
    const errorObject = message => ({ error: message })

    const isValidPhone = phone => /^\d{10}$/.test(phone?.trim())
    const isValidPassword = password =>
      typeof password === 'string' && password?.trim().length >= 4
    const sanitizeString = str => str?.replace(/[^a-zA-Z0-9\s]/g, '')?.trim()

    const validatePhone = phone =>
      isValidPhone(phone)
        ? phone?.trim()
        : errorObject('Phone number must be exactly 10 digits.')
    const validatePassword = password =>
      isValidPassword(password)
        ? password?.trim()
        : errorObject('Password must be at least 4 characters long.')
    const validateRequired = (field, fieldName) =>
      field ? sanitizeString(field) : errorObject(`${fieldName} is required.`)

    const getAnswerArray = () =>
      data?.selectedQuestions?.map(q => sanitizeString(data.answers[q])) || []

    switch (type) {
      case 'login': {
        const phone = validatePhone(data.loginPhone)
        const password = validatePassword(data.loginPassword)
        if (phone.error) return phone
        if (password.error) return password
        return { phone, password }
      }

      case 'register': {
        const phone = validatePhone(data.phone)
        const password = validatePassword(data.password)
        const name = validateRequired(data.name, 'Name')
        const address = validateRequired(data.streetAddress, 'Address')

        if (phone?.error) return phone
        if (password?.error) return password
        if (name?.error) return name
        if (address?.error) return address

        const answers = getAnswerArray()
        if (answers.length < 2) {
          return errorObject('Two answers are required for security questions.')
        }
        if (data.selectedQuestions?.length < 2) {
          return errorObject('Two security questions must be selected.')
        }

        return {
          name,
          phone,
          address,
          password,
          answers,
          securityQuestionOne: data.selectedQuestions[0],
          securityQuestionTwo: data.selectedQuestions[1]
        }
      }

      case 'requestRest': {
        const phone = validatePhone(data.resetPhone)
        
        const username = validateRequired(data.resetUsername, 'Username')
        if (phone?.error) return phone
        if (username?.error) return username
        return { phone, username }
      }

      case 'resetPassword': {
        const phone = validatePhone(data.resetPhone)
        const username = validateRequired(data.resetUsername, 'Username')
        const password = validatePassword(data.newPassword)

        if (phone?.error) return phone
        if (password?.error) return password

        const resetAnswersToArray = () =>
          data.selectedQuestions?.map(q =>
            sanitizeString(data.resetAnswers[q])
          ) || []

        const answers = resetAnswersToArray()
        if (answers.length <= 0) {
          return errorObject('Security answers are required.')
        }

        return { phone, username, answers, newPassword: password }
      }

      default:
        return errorObject('Invalid data type provided.')
    }
  }

  const CustomerLogin = async profile => {
    const isLoggedIn = getLocalStorage('online')

    if (isLoggedIn) {
      const savedProfile = getLocalStorage('profile')
      return { error: `Your already logged in as ${savedProfile.name}` }
    }

    profile = cleanData('login', profile)

    if (profile?.error) {
      return profile
    }
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    }
    try {
      const res = await fetch(`${ServerDomain}/customer-login`, configure)
      const data = await res.json()
      if (res.ok) {
        addToLocalStorage('profile', data.profile)
        addToLocalStorage('token', data.token)
        addToLocalStorage('online', true)

        return data
      }
      return data
    } catch (error) {
      return { error: 'Error while loggin... try again.' }
    }
  }

  const CustomerLogout = async () => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return { error: `Your not even logged in` }
    }
    const token = getLocalStorage('token')
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const res = await fetch(`${ServerDomain}/customer-logout`, configure)
      const data = await res.json()
      if (res.ok) {
        addToLocalStorage('profile', null)
        addToLocalStorage('token', null)
        addToLocalStorage('online', false)

        return data
      }
      return data
    } catch (error) {
      return { error: 'Error while loggin out... try again.' }
    }
  }

  const RegisterCustomer = async profile => {
    const isLoggedIn = getLocalStorage('online')
    if (isLoggedIn) {
      const savedProfile = getLocalStorage('profile')
      return { error: `Your already logged in as ${savedProfile.name}` }
    }

    profile = cleanData('register', profile)

    if (profile?.error) {
      return profile
    }
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    }
    try {
      const res = await fetch(`${ServerDomain}/customer-register`, configure)
      const data = await res.json()
      if (res.ok) {
        return data
      }
      return data
    } catch (error) {
      return { error: 'Error during registration... try again.' }
    }
  }

  const RestCustomerPassword = async profile => {
    profile = cleanData('resetPassword', profile)

    if (profile?.error) {
      return profile
    }

    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    }
    try {
      const res = await fetch(
        `${ServerDomain}/customer-rest-password`,
        configure
      )
      const data = await res.json()
      if (res.ok) {
        return data
      }
      return data
    } catch (error) {
      return { error: 'Error during password rest... try again.' }
    }
  }
  const RequestProfileUpdate = async profile => {
    console.log(profile)
    profile = cleanData('requestRest', profile)
console.log(profile)
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    }
    try {
      const res = await fetch(
        `${ServerDomain}/customer-profile-update`,
        configure
      )
      const data = await res.json()

      if (res.ok) {
        return data
      }
      return data
    } catch (error) {
      return { error: 'Error during registration... try again.' }
    }
  }

  const CancelCustomerOrder = async () => {}

  const UpdateOrderHistory = async orderDetails => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return { error: `Your not even logged in` }
    }
    const token = getLocalStorage('token')
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderDetails)
    }
    try {
      const res = await fetch(`${ServerDomain}/new-customer-order`, configure)
      const data = await res.json()
      if (res.ok) {
        return data
      }
      return data
    } catch (error) {
      return { error: 'Failed to update customer order history 🥺' }
    }
  }
  const UpdateCustomerProfile = async profile => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return { error: `Your not even logged in` }
    }
    
    const token = getLocalStorage('token')
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    }
    try {
      const res = await fetch(
        `${ServerDomain}/customer-update-profile`,
        configure
      )
      const data = await res.json()
      if (res.ok) {
        return data
      }
      return data
    } catch (error) {
      return { error: 'Failed to update customer order history 🥺' }
    }
  }

  const LoadEndUserProfile = () => {
    const bool = getLocalStorage('online')
    dispatch({ type: SHOW_CUSTOMER_PROFILE, payload: bool })
  }

  const ToggleProfile = () => {
    dispatch({ type: VIEW_PROFILE, payload: !profile })
  }

  return (
    <CustomerContext.Provider
      value={{
        profile,
        showLoginForm,
        showCustomerProfile,
        ToggleProfile,
        ToggleLoginForm,
        CustomerLogin,
        CustomerLogout,
        RegisterCustomer,
        RestCustomerPassword,
        RequestProfileUpdate,
        CancelCustomerOrder,
        UpdateOrderHistory,
        UpdateCustomerProfile,
        LoadEndUserProfile
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

CustomerProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default CustomerProvider
