import React, { useReducer } from 'react'
import CustomerContext from './context'
import CustomerReducer from './reducer'
import PropTypes from 'prop-types'

import { ServerDomain,LOGIN_FORM } from '../types'

function CustomerProvider ({ children }) {
  const initialState = {
    showLoginForm:false
  }
  const [state, dispatch] = useReducer(CustomerReducer, initialState)
  const {showLoginForm} = state
  const ToggleLoginForm = () => {
    dispatch({type:LOGIN_FORM, payload: !showLoginForm})
  }
  const addToLocalStorage = (name, data) =>
    localStorage.setItem(name, JSON.stringify(data))

  const getLocalStorage = name => JSON.parse(localStorage.getItem(name))

  const CustomerLogin = async profile => {
    const isLoggedIn = getLocalStorage('online')
    if (isLoggedIn) {
      const savedProfile = getLocalStorage('profile')
      return `Your already logged in as ${savedProfile.name}`
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

        return data.message
      }
      throw new Error(data.error || 'Failed to login')
    } catch (error) {
      console.error('Error: ', error)
      return 'Error while loggin... try again.'
    }
  }

  const CustomerLogout = async () => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return `Your not even logged in`
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

        return data.message
      }
      throw new Error(data.error || 'Failed to log out')
    } catch (error) {
      console.error('Error: ', error)
      return 'Error while loggin out... try again.'
    }
  }

  const RegisterCustomer = async profile => {
    const isLoggedIn = getLocalStorage('online')
    if (isLoggedIn) {
      const savedProfile = getLocalStorage('profile')
      return `Your already logged in as ${savedProfile.name}`
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
        return data.message
      }
      throw new Error(data.error || 'Failed to register')
    } catch (error) {
      console.error('Error: ', error)
      return 'Error during registration... try again.'
    }
  }

  const RestCustomerPassword = async profile => {
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
        return data.message
      }
      throw new Error(data.error || 'Failed to reset password')
    } catch (error) {
      console.error('Error: ', error)
      return 'Error during password rest... try again.'
    }
  }
  const RequestProfileUpdate = async profile => {
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
        // get answers for
        // data.securityQuestionOne,
        // data.securityQuestionTwo
        return data
      }
      throw new Error(data.error || 'Failed to register')
    } catch (error) {
      console.error('Error: ', error)
      return 'Error during registration... try again.'
    }
  }


  const CancelCustomerOrder = async () => {}

  const UpdateOrderHistory = async orderDetails => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return `Your not even logged in`
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
        return data.message
      }
      throw new Error(
        data.error || 'Failed to update customer order history 🥺'
      )
    } catch (error) {
      console.error('Error: ', error)
      return 'Failed to update customer order history 🥺'
    }
  }
  const UpdateCustomerProfile = async updates => {
    const isLoggedIn = getLocalStorage('online')
    if (!isLoggedIn) {
      return `Your not even logged in`
    }
    const profile = getLocalStorage('profile')
    const token = getLocalStorage('token')
    const configure = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...profile,
        ...updates
      })
    }
    try {
      const res = await fetch(
        `${ServerDomain}/customer-update-profile`,
        configure
      )
      const data = await res.json()
      if (res.ok) {
        return data.message
      }
      throw new Error(
        data.error || 'Failed to update customer order history 🥺'
      )
    } catch (error) {
      console.error('Error: ', error)
      return 'Failed to update customer order history 🥺'
    }
  }

  return (
    <CustomerContext.Provider
      value={{
        showLoginForm,
        ToggleLoginForm,
        CustomerLogin,
        CustomerLogout,
        RegisterCustomer,
        RestCustomerPassword,
        RequestProfileUpdate,
        CancelCustomerOrder,
        UpdateOrderHistory,
        UpdateCustomerProfile
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
