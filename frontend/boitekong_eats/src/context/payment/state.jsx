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
  ONLINE_PAY,
  ServerDomain
} from '../types'
import { generateOrderNumber, checkTime } from '../../utils/Utils'

function PaymentProvider ({ children }) {
  const userProfile = JSON.parse(localStorage.getItem('profile')) || {};
  
  const initialState = {
    name : userProfile?.name || '',
    phone : userProfile?.phone ||'',
    streetAddress : userProfile?.address || '',
    houseNumber: '',
    paymentMethod: 'self-collect',
    deliveryCharge: 0,
    paymentTotal: 0,
    paymentItems: [],
    orderSubmitted: false,
    orderNumber: 0,
    onlinePay: false
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
    orderNumber,
    onlinePay
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
  const handleDeliveryChargeChange = (charge = 20) => {
    dispatch({
      type: SET_DELIVERY_CHARGE,
      payload: charge
    })
  }
  const handlePaymentChange = e => {
    const method = e.target.value.trim()
    dispatch({ type: SET_PAYMENT_METHOD, payload: method })
    method === 'cash'
      ? handleDeliveryChargeChange(20)
      : handleDeliveryChargeChange(0)
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
  function formatCellNumber (number) {
    if (number.startsWith('0')) {
      return '27' + number.slice(1)
    }
    return number
  }

  const paymentGatewayOpen = () => {
    dispatch({ type: ONLINE_PAY, payload: true })
  }
  const paymetGatewayClosed = () => {
    dispatch({ type: ONLINE_PAY, payload: false })
  }

  /**
   * @function initOrderDetails
   * @description Initializes order details by gathering information about the order, cook, and support contacts.
   *              This method processes the order items, extracts relevant phone numbers, and prepares the
   *              order details in a format suitable for submission.
   * @returns {[Object, Set, Set]} Returns an array containing:
   *  - `newOrder` (Object): The newly created order object with details such as cook IDs, customer info, and payment item descriptions.
   *  - `supportPhones` (Set): A set of phone numbers for support contacts related to the order.
   *  - `cookPhones` (Set): A set of phone numbers for the cooks associated with the order.
   *
   * @example
   * const [newOrder, supportPhones, cookPhones] = initOrderDetails();
   *
   * // Example of newOrder object
   * {
   *   cookId: ['cook_123', 'cook_456'],
   *   orderNumber: 98765,
   *   name: 'John Doe',
   *   phone: '1234567890',
   *   streetAddress: '123 Main St',
   *   houseNumber: '12A',
   *   paymentMethod: 'Cash',
   *   paymentTotal: 300,
   *   deliveryCharge: 50,
   *   paymentItemsDescriptions: 'Pizza: Margherita (Qty: 2, Total: R150, Size: Large); Burger: Cheeseburger (Qty: 1, Total: R100)'
   * }
   */
  const initOrderDetails = () => {
    // Initialize sets to store unique phone numbers
    const supportPhones = new Set()
    const cookPhones = new Set()
    const cookId = new Set()

    // Map over payment items and construct item descriptions
    const paymentItemsDescriptions = paymentItems.map(
      ({ foodMenu, itemName, quantity, selectedSize, total, item }) => {
        // Store cook ID from each item
        cookId.add(item.cook_id)

        // Add support and cook phone numbers to respective sets
        if (item.support_phone) {
          supportPhones.add(item.support_phone)
        }
        if (item.cook_phone) {
          cookPhones.add(item.cook_phone)
        }

        // Return formatted string for the item description
        return `${foodMenu}: ${itemName} (Qty: ${quantity}, Total: R${total}${
          selectedSize ? `, Size: ${selectedSize}` : ''
        })`
      }
    )

    // Construct the new order object
    const newOrder = {
      cookId: Array.from(cookId), // Convert cookId Set to array
      orderNumber, // Predefined order number
      name, // Customer name
      phone, // Customer phone number
      streetAddress, // Delivery address
      houseNumber, // House number
      paymentMethod, // Payment method (e.g., Cash, Card)
      paymentTotal, // Total payment amount
      deliveryCharge, // Delivery fee
      paymentItemsDescriptions: paymentItemsDescriptions.join('; ') // Description of all items in the order
    }
    // Combine all data into a single object
    const orderData = {
      newOrder,
      supportPhones: Array.from(supportPhones), // Convert Set to array
      cookPhones: Array.from(cookPhones), // Convert Set to array,
      lineitems: paymentItemsDescriptions
    }

    // Store the object in local storage as a JSON string
    localStorage.setItem('orderData', JSON.stringify(orderData))
    // Return the new order object along with the sets of support and cook phone numbers
    return [newOrder, supportPhones, cookPhones]
  }

  const getStoredOrderData = () => {
    const storedOrderData = localStorage.getItem('orderData')
    return storedOrderData ? JSON.parse(storedOrderData) : null
  }
  /**
   * @function RedirectToCheckout
   * @description Initiates a payment process using the Yoco Payment Gateway. It checks the operating hours,
   *              stores the new order details, support phone numbers, and cook phone numbers in a single object
   *              in local storage to ensure persistence across tabs/windows, and then makes a payment request to the server.
   * @returns {Promise<Object>} Returns the result of the payment request from the server.
   */
  const RedirectToCheckout = async () => {
    try {
      // Check if it's outside of operating hours
      const notWorkingHours = operatingHours()

      if (notWorkingHours) {
        alert('⚠️ Operating hours between 09:00 am to 20:00 pm. 🌞')
        return
      }

      const orderData = getStoredOrderData()

      // Get current base URL
      const baseUrl = window.location.origin

      // Create paths for success and cancel
      const successUrl = `${baseUrl}/order-success`
      const cancelUrl = `${baseUrl}/cancel-order`
      const failureUrl = `${baseUrl}/failed-checkout`

      // Send the new order to the server for processing payment
      const response = await fetch(`${ServerDomain}/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newOrder: orderData.newOrder,
          paths: {
            successUrl,
            cancelUrl,
            failureUrl
          }
        })
      })

      const result = await response.json()

      return result // Return the server response (e.g., payment link or confirmation)
    } catch (error) {
      console.error('Error processing payment:', error)
    }
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
   * @param {string|null} cookMessage
   * @param {string|null} storeMessage
   * @param {array} supportPhones
   * @param {array} cookPhones
   */
  const orderNotification = async (
    customerMessage,
    cookMessage,
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
        const supportPromises = supportPhones.map(phone =>
          sendSms(phone, storeMessage)
        )
        const cookPromises = cookPhones.map(phone =>
          sendSms(phone, cookMessage)
        )

        promises.push(...supportPromises, ...cookPromises)
        // promises.push(...cookPromises)
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
    const notWorkingHours = operatingHours()

    switch (notWorkingHours) {
      case true:
        alert('⚠️ Operating hours between 09:00 am to 19:00 pm. 🌞')
        return false
      case false:
        updateOrderBoard(orderNumber)
        return true
      default:
        return false
    }
  }

  /***
   * @description determine if boitekong eats is open or closed
   * @return {boolean}
   */
  const operatingHours = () => {
    const { startTime, endTime, currentTime } = checkTime()
    const notWorkingHours = currentTime < startTime || currentTime > endTime
    return notWorkingHours
  }

  /**
   * @param {number} orderNumber - The order number.
   * @param {object} [newOrder] - Optional. The new order details, if already available.
   * @param {Array} [supportPhones] - Optional. Array of support phone numbers.
   * @param {Array} [cookPhones] - Optional. Array of cook phone numbers.
   * @description Sends new order to order collection and handles notifications.
   */
  const updateOrderBoard = async (
    orderNumber,
    newOrder,
    supportPhones,
    cookPhones
  ) => {
    // If newOrder, supportPhones, or cookPhones are not provided, get them from initOrderDetails
    if (!newOrder || !supportPhones || !cookPhones) {
      const [generatedNewOrder, generatedSupportPhones, generatedCookPhones] =
        initOrderDetails()
      newOrder = newOrder || generatedNewOrder
      supportPhones = supportPhones || generatedSupportPhones
      cookPhones = cookPhones || generatedCookPhones
    }

    try {
      // Send the new order to the server
      const response = await fetch(`${ServerDomain}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      })

      if (response.ok) {
        // Destructure messages, default to null if messages are not available
        const [
          customerMessage = null,
          cookMessage = null,
          storeMessage = null
        ] = initOrderMessages(orderNumber)

        // Notify with messages and phone numbers
        orderNotification(
          customerMessage,
          cookMessage,
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

    const paymentPendingMessage = `${baseMessage}your placed order at BoitekongEats is pending. Pay R${paymentTotal} to account number details found on the web-app. Use ${orderNumber} as reference. Once payment is successful, your order will be processed. WhatsApp +(27)67 271 8374`
    const selfCollectMessage = `${baseMessage}your order is being processed at BoitekongEats. You'll be notified to come and collect once done. The total is R${paymentTotal}, pay on collection. Track your order with ${orderNumber} on the web-app.`
    const cashDeliveryMessage = `${baseMessage}your order is being processed at BoitekongEats. You'll be notified when order is ready for delivery. Pay R${paymentTotal} on delivery. Track your order with ${orderNumber} on the web-app.`

    if (
      paymentMethod === 'online-delivery' ||
      paymentMethod === 'online' ||
      paymentTotal > 200
    ) {
      customerMessage = paymentPendingMessage
    } else if (paymentTotal <= 200) {
      if (paymentMethod === 'self-collect') {
        customerMessage = selfCollectMessage
      } else if (paymentMethod === 'cash') {
        customerMessage = cashDeliveryMessage
      }
    }

    const cookMessage = [
      `Boitekong Eats, order received! Order: ${orderNumber}`,
      `Name: ${name}`,
      `Delivery: ${
        paymentMethod === 'cash' || paymentMethod === 'online-delivery'
          ? 'yes'
          : 'self-collect'
      }`,
      `Total: R${paymentTotal}`,
      `Notify ${name} when the order is ready for ${
        paymentMethod === 'cash' || paymentMethod === 'online-delivery'
          ? 'delivery'
          : 'self-collect'
      }.`
    ]
      .filter(Boolean)
      .join('. ')

    // sms for boitekong eats
    const storeMessage = [
      `Boitekong Eats, order received! Order: ${orderNumber}`,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null
    ]
      .filter(Boolean)
      .join('. ')

    // Return both customerMessage and storeMessage if customerMessage
    // is either selfCollectMessage or cashDeliveryMessage
    if (
      customerMessage === selfCollectMessage ||
      customerMessage === cashDeliveryMessage
    ) {
      return [customerMessage, cookMessage, storeMessage]
    }

    // Return customerMessage normally
    return [customerMessage, null, storeMessage]
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
        initOrderNumber,
        RedirectToCheckout,
        initOrderDetails,
        paymentGatewayOpen,
        paymetGatewayClosed,
        handleDeliveryChargeChange,
        onlinePay
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
