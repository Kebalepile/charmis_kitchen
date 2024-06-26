import React, { useReducer, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import OrderContext from './context'
import Reducer from './reducer'
import {
  SET_QUANTITY,
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

    total: 0,
    selectedSize: '',
    fooMenu: '',
    basket: false,
    basketItems: []
  }

  const [state, dispatch] = useReducer(Reducer, initialState)
  const [shouldReset, setShouldReset] = useState(false)

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
    // console.log(basket)

    if (basket) {
      dispatch({ type: BASKET_ITEMS, payload: [...basketItems, order] })
    } else {
      dispatch({ type: BASKET, payload: true })
      dispatch({ type: BASKET_ITEMS, payload: [order] })
    }
  }
  const updateBasketItems = updatedArr => {
    dispatch({ type: BASKET_ITEMS, payload: updatedArr })
  }
  const handleCloseBasket = () => {
    dispatch({ type: BASKET, payload: false })
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

    // console.log(orderDetails)
    handleBasketItems(orderDetails)

    localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    onClose()
    setShouldReset(true)
  }
  /**
   * @description restorder form state to inital state
   */

  const handleRest = () => {
    setShouldReset(true)
  }

  useEffect(() => {
    if (shouldReset) {
      const preservedState = {
        ...initialState,
        basket: state.basket,
        basketItems: state.basketItems
      }
      dispatch({ type: REST_ORDER_STATE, payload: preservedState })
      setShouldReset(false)
    }
  }, [shouldReset, state.basket, state.basketItems])

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
        handleSizeChange,
        calculateTotal,
        handleSubmit,
        handleRest,
        updateBasketItems,
        handleCloseBasket
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
