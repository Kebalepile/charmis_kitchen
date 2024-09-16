import React, { useReducer } from 'react'
import PaymentContext from './context'
import PaymentReducer from './reducer'
import PropTypes from 'prop-types'
import {
  ORDER_NUMBER,
  PAYMENT,
  ORDER_PUNCHED,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  SET_STREET_ADDRESS,
  SET_HOUSENUMBER,
  RESET_PAYMENT_STATE,
  ServerDomain
} from '../types'
import { generateOrderNumber, checkTime } from '../../utils/Utils'

function PaymentProvider({ children }) {
  const initialState = {
    name: '',
    phone: '',
    streetAdress: '',
    houseNumber: '',
    paymentMethod: 'self-collect',
    deliveryCharge: 0,
    paymentTotal: 0,
    paymentItems: [],
    orderSubmitted: false,
    orderNumber: 0
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
    orderSubmitted,
    orderNumber
  } = state

  const resetPaymentState = () => {
    dispatch({ type: RESET_PAYMENT_STATE, payload: initialState })
    return true
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
      payload: method === 'cash' ? 20 : method === 'online-delivery' ? 20 : 0
    })
  }
  /**
   * @description Get sum of all items
   * @param {array} items
   */
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

  const initOrderNumber = () => {
    // const orderNumber;
    dispatch({ type: ORDER_NUMBER, payload: generateOrderNumber() })
    return orderNumber
  }
  /**
   * @description format phone numbers
   * @param {string} number
   * @returns string
   */
  function formatCellNumber(number) {
    if (number.startsWith('0')) {
      return '27' + number.slice(1)
    }
    return number
  }

  /**
   * @description sends an SMS to a given phone number.
   * @param {string} phone
   * @param {string} message
   * @returns returns a promise
   */
  const sendSms = async (phone, message) => {
    try {
      const response = await fetch(`${ServerDomain}/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: phone, message })
      })
      const data = await response.json()
      if (data.success) {
        return true
      } else {
        throw new Error('Failed to send SMS')
      }
    } catch (error) {
      console.error('Error sending SMS:', error)
      throw error
    }
  }

  /**
   * @description ensures that SMS messages are sent to all required recipients in parallel
   * @param {string|null} customerMessage
   * @param {string|null} storeMessage
   * @param {array} supportPhones
   * @param {array} cookPhones
   */
  const orderNotification = async (
    customerMessage,
    storeMessage,
    supportPhones,
    cookPhones
  ) => {
    try {
      // Format all phone numbers
      supportPhones = supportPhones.map(phone => formatCellNumber(phone))
      cookPhones = cookPhones.map(phone => formatCellNumber(phone))
      const customerNumber = formatCellNumber(state.phone)

      // Prepare promises array
      const promises = []

      // If customerMessage is neither null nor an empty string, send SMS to customer
      if (customerMessage && customerMessage.trim()) {
        const customerPromise = sendSms(customerNumber, customerMessage)
        promises.push(customerPromise)
      }

      // If storeMessage is neither null nor an empty string, 
      // send SMS to all support and cook phone numbers
      if (storeMessage && storeMessage.trim()) {
        // const supportPromises = supportPhones.map(phone =>
        //   sendSms(phone, storeMessage)
        // )
        const cookPromises = cookPhones.map(phone =>
          sendSms(phone, storeMessage)
        )

        // promises.push(...supportPromises, ...cookPromises)
        promises.push(...cookPromises)
      }

      // Wait for all promises to resolve
      await Promise.all(promises)

      // Call restPunchedOrder() after all SMSs are sent
      restPunchedOrder()
    } catch (error) {
      console.error('Error preparing SMS:', error)
    }
  }

  const handleSubmitOrder = async () => {
    const { startTime, endTime, currentTime } = checkTime()
    const notWorkingHours = currentTime < startTime || currentTime > endTime

    switch (notWorkingHours) {
      case true:
        alert('⚠️ Operating hours between 09:00 am to 20:00 pm. 🌞')
        return false
      case false:
        updateOrderBoard(orderNumber)
        return true
      default:
        return false
    }
  }

  /**
   *
   * @param {number} orderNumber
   * @descirption send new order to order collection.
   */
  const updateOrderBoard = async orderNumber => {
    const supportPhones = new Set()
    const cookPhones = new Set()
    const cookId = new Set()

    const paymentItemsDescriptions = paymentItems
      .map(({ foodMenu, itemName, quantity, selectedSize, total, item }) => {
        cookId.add(item.cook_id)
        // Add support and cook phone numbers to respective sets
        if (item.support_phone) {
          supportPhones.add(item.support_phone)
        }
        if (item.cook_phone) {
          cookPhones.add(item.cook_phone)
        }

        return `${foodMenu}: ${itemName} (Qty: ${quantity}, Total: R${total}${selectedSize ? `, Size: ${selectedSize}` : ''
          })`
      })
      .join('; ')

    const newOrder = {
      cookId: Array.from(cookId),
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
      const response = await fetch(`${ServerDomain}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      })

      if (response.ok) {
        // Destructure with default values
        const [customerMessage = null, storeMessage = null] =
          initOrderMessages(orderNumber)

        orderNotification(
          customerMessage,
          storeMessage,
          Array.from(supportPhones),
          Array.from(cookPhones)
        )
      } else {
        console.error('Error submitting order:', response.statusText)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
    }
  }

  /**
   * @description create text messages.
   * @param {number} orderNumber
   * @returns array of strings
   */
  const initOrderMessages = orderNumber => {
    const baseMessage = `hey ${name}, `
    let customerMessage = ''

    const paymentPendingMessage = `${baseMessage}your placed order at BoitekongEats is pending. Pay R${paymentTotal} to account number details found on the web-app. Use ${orderNumber} as reference. Once payment is successful, your order will be processed.`
    const selfCollectMessage = `${baseMessage}your order is being processed at BoitekongEats. You'll be notified to come and collect once done. The total is R${paymentTotal}. Track your order with ${orderNumber} on the web-app.`
    const cashDeliveryMessage = `${baseMessage}your order is being processed at BoitekongEats. Pay R${paymentTotal} on delivery. Track your order with ${orderNumber} on the web-app.`

    if (
      paymentMethod === 'online-delivery' ||
      paymentMethod === 'online' ||
      paymentTotal > 50
    ) {
      customerMessage = paymentPendingMessage
    } else if (paymentTotal <= 50) {
      if (paymentMethod === 'self-collect') {
        customerMessage = selfCollectMessage
      } else if (paymentMethod === 'cash') {
        customerMessage = cashDeliveryMessage
      }
    }

    const storeMessage = [
      `Boitekong Eats, order received! Order: ${orderNumber}`,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      streetAddress ? `Address: ${streetAddress}, House: ${houseNumber}` : null,
      `Delivery: ${paymentMethod.includes('delivery') ? 'yes' : 'self-collect'
      }`,
      `Total: R${paymentTotal}`,
      `Notify ${name} at ${phone} when the order is ready for ${paymentMethod.includes('delivery') ? 'delivery' : 'self-collect'
      }.`
    ]
      .filter(Boolean)
      .join('. ')

    // Return both customerMessage and storeMessage if customerMessage
    // is either selfCollectMessage or cashDeliveryMessage
    if (
      customerMessage === selfCollectMessage ||
      customerMessage === cashDeliveryMessage
    ) {
      return [customerMessage, storeMessage]
    }

    // Return customerMessage normally
    return [customerMessage]
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
        orderNumber,
        handleNameChange,
        handlePhoneChange,
        handlePaymentChange,
        handlePaymentItems,
        handleSubmitOrder,
        handleHouseNumbersChange,
        handleStreetAddressChange,
        restPunchedOrder,
        resetPaymentState,
        initOrderNumber
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
