import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import OrderContext from './context'
import Reducer from './reducer'
import {
  SET_QUANTITY,
  SET_NAME,
  SET_PHONE,
  SET_PAYMENT_METHOD,
  SET_DELIVERY_CHARGE,
  SET_TOTAL,
  SET_SELECTED_SIZE,
  REST_ORDER_STATE,
  BASKET,
  BASKET_ITEMS
} from '../types'

const OrderProvider = ({ children }) => {
  const initialState = {
    quantity: 0,
    name: '',
    phone: '',
    paymentMethod: 'self-collect',
    deliveryCharge: 20,
    total: 0,
    selectedSize: '',
    fooMenu: '',
    basket: false,
    basketItems: []
  }

  const [state, dispatch] = useReducer(Reducer, initialState)
  const {
    quantity,
    name,
    phone,
    paymentMethod,
    deliveryCharge,
    total,
    selectedSize,
    basket,
    basketItems
  } = state

  const handleBasketItems = order => {
    console.log(basket)
    console.log(state)
    if (basket) {
      dispatch({ type: BASKET_ITEMS, payload: [...basketItems, order] })
    } else {
      dispatch({ type: BASKET, payload: true })
      dispatch({ type: BASKET_ITEMS, payload: [order] })
      console.log("basket activted")
    }
  }
  const handleQuantityChange = e => {
    let value = parseInt(e.target.value, 10)
    if (isNaN(value) || value < 1) {
      value = 1
    } else if (value > 25) {
      value = 25
    }
    dispatch({ type: SET_QUANTITY, payload: value })
  }

  const handleNameChange = e => {
    dispatch({ type: SET_NAME, payload: e.target.value })
  }

  const handlePhoneChange = e => {
    const cleanedPhone = e.target.value.replace(/\D/g, '')
    dispatch({ type: SET_PHONE, payload: cleanedPhone.slice(0, 10) })
  }

  const handlePaymentChange = e => {
    const method = e.target.value
    dispatch({ type: SET_PAYMENT_METHOD, payload: method })
    dispatch({
      type: SET_DELIVERY_CHARGE,
      payload: method === 'cash' ? 20 : method === 'online' ? 15 : 0
    })
  }

  const handleSizeChange = e => {
    dispatch({ type: SET_SELECTED_SIZE, payload: e.target.value })
  }

  const calculateTotal = item => {
    let price = 0
    if (item.price) {
      price = parseInt(item.price.substring(1))
    } else if (item.prices && state.selectedSize) {
      price = parseInt(item.prices[state.selectedSize].substring(1))
    }

    const paymentCharge =
      state.paymentMethod === 'cash'
        ? 20
        : state.paymentMethod === 'online'
        ? 15
        : 0
    const totalAmount = price * state.quantity + paymentCharge

    dispatch({ type: SET_DELIVERY_CHARGE, payload: paymentCharge })
    dispatch({ type: SET_TOTAL, payload: totalAmount })
  }

  const generateOrderNumber = () => {
    // Generate a 4-digit random number using crypto API
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % 10000 // Ensure it's a 4-digit number
  }

  const handleSubmit = (e, foodMenu, item, onClose) => {
    e.preventDefault()
    // NB to order details add house addres or street address
    const orderNumber = generateOrderNumber() // Generate unique order number
    const orderDetails = {
      foodMenu,
      item,
      itemName: item.name,
      quantity: state.quantity,
      total: state.total,
      selectedSize: state.selectedSize,
      orderNumber
    }
    //  name: state.name,
    //   phone: state.phone,
    //   paymentMethod: state.paymentMethod,
    //   deliveryCharge: state.deliveryCharge,
    console.log(orderDetails)
    handleBasketItems(orderDetails)
    // SubmitOrder(orderDetails)
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    onClose()
    // handleRest()
  }
  /**
   * @description restorder form state to inital state
   */
  const handleRest = () => {
    const preservedState = {
      ...initialState,
      basket: state.basket,
      basketItems: state.basketItems
    }
    console.log(preservedState)
    dispatch({ type: REST_ORDER_STATE, payload: preservedState }) }

  // const SubmitOrder = async order => {
  
  //   const customerMessage = `Dear ${order.name},\n your Order number: ${
  //     order.orderNumber
  //   } for ${order.quantity} ${order.itemName} ${
  //     order.selectedSize.length ? `, \n size: ${order.selectedSize}` : ''
  //   } has been received by the store. \n It will be ready in about 25 minutes. \n Delivery: ${
  //     order.deliveryCharge > 0 ? 'yes' : 'self collect'
  //   }`
  //   const storeMessage = `New order received! Order number: ${order.orderNumber},
  //    \n Customer: ${name}, \n Phone: ${phone}, \n Item: ${order.itemName}, \n Quantity: ${order.quantity},
  //    \n Payment method ${order.paymentMethod} \n Total price: ${order.total}.`

  //   console.log(customerMessage)
  //   console.log(storeMessage)
  //   // Send SMS using the backend API
  //   try {
  //     const response = await fetch('http://localhost:5000/send-sms', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         customerNumber: state.phone,
  //         storeNumber: '0672718374', // Replace with the store owner's number
  //         customerMessage,
  //         storeMessage
  //       })
  //     })

  //     const text = await response.text() // Read response as plain text
  //     console.log('Response from backend:', text)

  //     if (response.ok) {
  //       console.log('SMS sent successfully')
  //     } else {
  //       console.error('Failed to send SMS')
  //     }
  //   } catch (error) {
  //     console.error('Error sending SMS:', error)
  //   }
  // }
  return (
    <OrderContext.Provider
      value={{
        quantity,
        name,
        phone,
        paymentMethod,
        deliveryCharge,
        total,
        selectedSize,
        basket,
        basketItems,
        handleQuantityChange,
        handleNameChange,
        handlePhoneChange,
        handlePaymentChange,
        handleSizeChange,
        calculateTotal,
        handleSubmit,
        handleRest
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default OrderProvider
