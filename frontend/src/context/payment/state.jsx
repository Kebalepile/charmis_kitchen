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
  SET_HOUSENUMBER,
  REST_PAYMENT_STATE
} from '../types'

function PaymentProvider ({ children }) {
  const initialState = {
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

  const [state, dispatch] = useReducer(PaymentReducer, initialState)
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

  const resetPaymentState = () => {
    dispatch({ type: REST_PAYMENT_STATE, payload:initialState})
  }
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
    const method = e.target.value.trim()
    dispatch({ type: SET_PAYMENT_METHOD, payload: method })
    dispatch({
      type: SET_DELIVERY_CHARGE,
      payload: method === 'cash' ? 10 : method === 'online' ? 15 : 0
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
    dispatch({ type: ORDER_PUNCHED, payload: !orderSubmitted })
  }

  /**
   *
   * @param {string} customerMessage
   * @param {string} storeMessage
   * @description Send SMS using the backend API
   */
  const orderNotification = async (customerMessage, storeMessage) => {
    try {
      const response = await fetch('http://localhost:5000/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerNumber: state.phone,
          storeNumber: '0633343249', // Replace with the store owner's number
          customerMessage,
          storeMessage
        })
      })

      const text = await response.text() // Read response as plain text
      console.log('Response from backend:', text)

      if (response.ok) {
        console.log('SMS sent successfully')
        restPunchedOrder()
      } else {
        console.error('Failed to send SMS')
      }
    } catch (error) {
      console.error('Error sending SMS:', error)
    }
  }

  const handleSubmitOrder = async () => {
    console.dir(state)

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
      deliveryCharge ? `\n 🚚 Delivery Charge: R${deliveryCharge}` : `Order collection point: 2379 Windsa st, Boitekong Ext 2`,
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
    if (
      paymentMethod.trim() === 'self-collect' ||
      paymentMethod.trim() === 'cash'
    ) {
      orderNotification(customerMessage, storeMessage)
    } else if (
      paymentMethod.trim() === 'online-self-collect' ||
      paymentMethod.trim() === 'online-self-collect'
    ) {
      console.log('loading gateway payment system.')
      // after the above is done call ordernotification method.
      orderNotification(customerMessage, storeMessage)
    }
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
        restPunchedOrder,
        resetPaymentState
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
