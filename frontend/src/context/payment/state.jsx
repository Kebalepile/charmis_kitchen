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
  SET_STREET_ADDRESS,
  SET_HOUSENUMBER,
  REST_PAYMENT_STATE
} from '../types'
import { generateOrderNumber } from '../../utils/Utils'
import useWebSocket from '../../hooks/useWebSocket'

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

  const handleWebSocketMessage = message => {
    // handle the incoming WebSocket message here
    console.log('Received WebSocket message:', message)
    alert('Received WebSocket message:', message)
    // For example, you could dispatch an action based on the message content
  }

  useWebSocket('ws://localhost:5000', handleWebSocketMessage)

  const resetPaymentState = () => {
    dispatch({ type: REST_PAYMENT_STATE, payload: initialState })
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
   * @description format phone numbers
   * @param {string} number
   * @returns string
   */
  function formatCellNumber (number) {
    if (number.startsWith('0')) {
      return '27' + number.slice(1)
    }
    return number
  }
  /**
   *
   * @param {string} customerMessage
   * @param {string} storeMessage
   * @description Send SMS using the backend API
   */
  const orderNotification = async (customerMessage, storeMessage) => {
    try {
      const customerNumber = formatCellNumber(state.phone),
        storeNumber = formatCellNumber('0672718374')
      const apiKey = 'mQ-6Cd1RRT-BkEUpa7Xgbw=='

      const clickTelApi = (phone, message, apiKey) => {
        try {
          const xhr = new XMLHttpRequest()
          xhr.open(
            'GET',
            `https://platform.clickatell.com/messages/http/send?apiKey=${apiKey}&to=${phone}&content=${message}`,
            true
          )
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              console.log('success')
              restPunchedOrder()
            } else if (xhr.status == 202) {
              console.log(xhr.status)
              console.log(
                'request has been accepted for processing, but the processing has not been finished yet'
              )
              restPunchedOrder()
            } else {
              console.log(xhr.status)
              console.log('somthings wrong')
            }
          }
          xhr.send()

          // 0633343249
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error)
        }
      }
      console.log(storeMessage)
      clickTelApi(storeNumber, storeMessage, apiKey)
      console.log(customerMessage)
      clickTelApi(customerNumber, customerMessage, apiKey)
    } catch (error) {
      console.error('Error sending SMS:', error)
    }
  }

  const handleSubmitOrder = async () => {
    let paymentItemsDescriptions = paymentItems
      .map(({ foodMenu, itemName, quantity, selectedSize, total }) => {
        return `${foodMenu}: ${itemName} ( Qty: ${quantity}, Total: R${total}${
          selectedSize ? `, Size: ${selectedSize}` : ''
        })`
      })
      .join('; ')

    const orderNumber = generateOrderNumber() // Generate unique order number
    const [customerMessage, storeMessage] = initOrderMessages(orderNumber)

    if (
      paymentMethod.trim() === 'self-collect' ||
      paymentMethod.trim() === 'cash'
    ) {
      orderNotification(customerMessage, storeMessage)
      updateOrderBoard(orderNumber, paymentItemsDescriptions)
    } else if (
      paymentMethod.trim() === 'online-self-collect' ||
      paymentMethod.trim() === 'online-self-collect'
    ) {
      console.log('loading gateway payment system.')
      // after the above is done call ordernotification method.
      orderNotification(customerMessage, storeMessage)
      updateOrderBoard(orderNumber, paymentItemsDescriptions)
    }
  }
  /**
   * @description create sms to send alert customer and store respectivly of new order being submitted.
   * @param {number} orderNumber
   * @param {string} paymentItemsDescriptions
   * @returns array of sms strings
   */
  const initOrderMessages = orderNumber => {
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

    const customerMessage = [
      `Julia's Kitchen ORDER NOTIFICATION:`,
      `Order: ${orderNumber}`,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      streetAddress ? `Address: ${streetAddress}` : null,
      houseNumber ? `House: ${houseNumber}` : null,
      `Delivery: ${paymentMethod}`,
      `Total: R${paymentTotal}`,
      deliveryCharge
        ? `Delivery: R${deliveryCharge}`
        : `Collection: 2379 Windsa St, Boitekong Ext 2`,
      `You'll be notified via SMS when the order is ready.`,
      `Track your order on the order board using your name and order number.`
    ]
      .filter(Boolean)
      .join(' ')

    const storeMessage = [
      `New order received!`,
      `Order: ${orderNumber}`,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      streetAddress ? `Address: ${streetAddress}` : null,
      houseNumber ? `House: ${houseNumber}` : null,
      `Delivery: ${paymentMethod}`,
      `Total: R${paymentTotal}`,
      deliveryCharge ? `Delivery: R${deliveryCharge}` : null,
      `Notify ${name} at ${phone} when the order is ready for ${deliveryType(
        paymentMethod
      )}.`
    ]
      .filter(Boolean)
      .join(' ')

    return [customerMessage, storeMessage]
  }

  /**
   *
   * @param {number} orderNumber
   * @param {string} paymentItemsDescriptions
   * @descirption send new order to order database.
   */
  const updateOrderBoard = async (orderNumber, paymentItemsDescriptions) => {
    const newOrder = {
      orderNumber,
      name,
      phone,
      streetAddress,
      houseNumber,
      paymentMethod,
      paymentTotal,
      deliveryCharge,
      paymentItemsDescriptions
    }

    try {
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Order submitted:', result)
        // Optionally reset form or display a success message
      } else {
        console.error('Error submitting order:', response.statusText)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
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
