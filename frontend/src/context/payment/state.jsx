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
    paymentItems: [],
    orderSubmitted: false
  }

  const [state, dispatch] = useReducer(PaymentReducer, initailState)
  const {
    name,
    phone,
    streetAddress,
    houseNumber,
    paymentMethod,
    deliveryCharge,
    paymentTotal,
    paymentItems,
    orderSubmitted
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
  const restPunchedOrder = () => {
    dispatch({ type: ORDER_PUNCHED, payload: true })
  }
  // update method code
  const handleSubmitOrder = async () => {
    console.dir(state)
    // const punchOrder = async (order) => {}
    // const paymentGateWay = () => {}
    let paymentItemsDescriptions = paymentItems
      .map(
        ({
          foodMenu,
          itemName,
          orderNumber,
          quantity,
          selectedSize,
          total
        }) => {
          return `\n ${foodMenu}: \n ${itemName} \n(Order Number: ${orderNumber}\n Quantity: ${quantity}\n Total: R${total}${
            selectedSize ? `\n Size: ${selectedSize}` : ''
          })`
        }
      )
      .join('\n ')

    const customerMessage = [
      `\n 🍽️ Charmi's Kitchen ORDER NOTIFICATION:
      \n 🧑 Name: ${name}`,
      phone ? `\n 📞 Phone: ${phone}` : null,
      streetAddress ? `\n 🏠 Address: ${streetAddress}` : null,
      houseNumber ? `\n 🔢 House Number: ${houseNumber}` : null,
      `\n 💳 Payment Method: ${paymentMethod}`,
      `\n 💰 Payment Total: R${paymentTotal}`,
      deliveryCharge ? `\n 🚚 Delivery Charge: R${deliveryCharge}` : null,
      `\n 📦 Payment Items: \n ${paymentItemsDescriptions}
      \n 📲 You'll be notified via SMS when the order is ready.`
    ]
      .filter(Boolean)
      .join('')

    const deliveryType = type => {
      switch (type.trim()) {
        case 'online':
        case 'cash':
          return 'delivery'
        case 'online-self-collect':
        case 'self-collect':
          return 'self collect'
      }
    }
    const storeMessage = [
      `\n 🆕 New order received!:
      \n 🧑 Name: ${name}`,
      phone ? `\n 📞 Phone: ${phone}` : null,
      streetAddress ? `\n 🏠 Address: ${streetAddress}` : null,
      houseNumber ? `\n 🔢 House Number: ${houseNumber}` : null,
      `\n 💳 Payment Method: ${paymentMethod}`,
      `\n 💰 Payment Total: R${paymentTotal}`,
      deliveryCharge ? `\n 🚚 Delivery Charge: R${deliveryCharge}` : null,
      `\n 📦 Payment Items: \n ${paymentItemsDescriptions}
      \n 📲 Send SMS or call ${name} at ${phone} when the order is ready for ${deliveryType(
        paymentMethod
      )}.`
    ]
      .filter(Boolean)
      .join('')

    console.log(customerMessage)
    console.log('\n')
    console.log(storeMessage)
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
        orderSubmitted,
        handleNameChange,
        handlePhoneChange,
        handlePaymentChange,
        handlePaymentItems,
        handleSubmitOrder,
        handleHouseNumbersChange,
        handleStreetAddressChange,
        restPunchedOrder
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
