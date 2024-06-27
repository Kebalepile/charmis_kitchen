import React, { useReducer } from 'react'
import PaymentContext from './context'
import PaymentReducer from './reducer'
import PropTypes from 'prop-types'
import {
  PAYMENT,
  ORDER_PUNCHED,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  // PAYMENT_FORM_INFO,
  SET_STREET_ADDRESS,
  SET_HOUSENUMBER
} from '../types'

function PaymentProvider ({ children }) {
  const initailState = {
    name: '',
    phone: '',
    streetAdress: '',
    houseNumber: '',
    paymentMethod: 'self-collect',
    deliveryCharge: 0,
    paymentTotal: 0,
    paymentItems: []
  }

  const [state, dispatch] = useReducer(PaymentReducer, initailState)
  const {
    name,
    phone,
    streetAddress,
    houseNumber,
    paymentMethod,
    deliveryCharge,
    paymentTotal
  } = state

  const handleNameChange = e => {
    dispatch({ type: SET_NAME, payload: e.target.value })
  }

  const handlePhoneChange = e => {
    const cleanedPhone = e.target.value.replace(/\D/g, '')
    dispatch({ type: SET_PHONE, payload: cleanedPhone.slice(0, 10) })
  }

  const handleHouseNumbersChange = e => {
    dispatch({ type: SET_HOUSENUMBER, payload: e.target.value })
  }

  const handleStreetAddressChange = e => {
    dispatch({ type: SET_STREET_ADDRESS, payload: e.target.value })
  }

  const handlePaymentChange = e => {
    const method = e.target.value
    dispatch({ type: SET_PAYMENT_METHOD, payload: method })
    dispatch({
      type: SET_DELIVERY_CHARGE,
      payload: method === 'cash' ? 20 : method === 'online' ? 15 : 0
    })
  }
  //    get order items from order state write method that does so.
  const handlePaymentItems = items => {
    let paymentTotal = items.reduce((acc, cur) => {
      acc += cur.total

      return acc
    }, 0)

    paymentTotal += deliveryCharge

    dispatch({ type: PAYMENT, payload: { paymentTotal, paymentItems: items } })
  }

  // update method code
  const handleSubmitOrder = async () => {
    dispatch({ type: ORDER_PUNCHED, payload: true })

    console.dir(state)
    // const punchOrder = async (order) => {}
      // const paymentGateWay = () => {}
    switch (state.paymentMethod) {
      case 'self-collect':
      case 'cash':
        console.log('run cash / self-collect logic.')
        break
      case 'online-self-collect':
        console.log('run online self collect logic')
        break
      case 'online':
        console.log('run online payment logic')
        break
    }
    // const customerMessage = `Dear ${order.name},\n your Order number: ${
    //   order.orderNumber
    // } for ${order.quantity} ${order.itemName} ${
    //   order.selectedSize.length ? `, \n size: ${order.selectedSize}` : ''
    // } has been received by the store. \n It will be ready in about 25 minutes. \n Delivery: ${
    //   order.deliveryCharge > 0 ? 'yes' : 'self collect'
    // }`
    // const storeMessage = `New order received! Order number: ${order.orderNumber},
    //    \n Customer: ${name}, \n Phone: ${phone}, \n Item: ${order.itemName}, \n Quantity: ${order.quantity},
    //    \n Payment method ${order.paymentMethod} \n Total price: ${order.total}.`

    // console.log(customerMessage)
    // console.log(storeMessage)
    // // Send SMS using the backend API
    // try {
    //   const response = await fetch('http://localhost:5000/send-sms', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       customerNumber: state.phone,
    //       storeNumber: '0672718374', // Replace with the store owner's number
    //       customerMessage,
    //       storeMessage
    //     })
    //   })

    //   const text = await response.text() // Read response as plain text
    //   console.log('Response from backend:', text)

    //   if (response.ok) {
    //     console.log('SMS sent successfully')
    //   } else {
    //     console.error('Failed to send SMS')
    //   }
    // } catch (error) {
    //   console.error('Error sending SMS:', error)
    // }
  }

  return (
    <PaymentContext.Provider
      value={{
        name,
        phone,
        streetAddress,
        houseNumber,
        paymentMethod,
        deliveryCharge,
        paymentTotal,
        handleNameChange,
        handlePhoneChange,
        handlePaymentChange,
        handlePaymentItems,
        handleSubmitOrder,
        handleHouseNumbersChange,
        handleStreetAddressChange
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default PaymentProvider
