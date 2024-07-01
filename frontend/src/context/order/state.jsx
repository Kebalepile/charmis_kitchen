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
  BASKET_ITEMS,
  GET_ORDERS,
  UPDATE_ORDER,
  DELETE_ORDER,
  SEARCH_ORDER_FORM_VISIBLE,
  ServerDomain
} from '../types'

const OrderProvider = ({ children }) => {
  const initialState = {
    quantity: 0,
    total: 0,
    selectedSize: '',
    fooMenu: '',
    basket: false,
    basketItems: [],
    orders: [],
    searchOrderFormVisible:false
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
    basketItems,
    orders,
    searchOrderFormVisible
  } = state

  const setIsSearchOrderVisible = () => {
    dispatch({ type: SEARCH_ORDER_FORM_VISIBLE, payload: !searchOrderFormVisible})
  }
  const clearOrders = () => {
    dispatch({ type: GET_ORDERS, payload: [] })
  }

  const getOrder = async orderNumber => {
    try {
      const response = await fetch(`${ServerDomain}/orders/${orderNumber}`)
      const data = await response.json()
      dispatch({ type: GET_ORDERS, payload: [data] })
      return true

    } catch (error) {
      console.error('Failed to fetch order:', error)
    }
  }

  const getOrders = async () => {
    try {
      const response = await fetch(`${ServerDomain}/orders`)
      const data = await response.json()
      dispatch({ type: GET_ORDERS, payload: data })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }
  const updateOrder = async (id, updateData) => {
    try {
      const response = await fetch(`${ServerDomain}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      const data = await response.json()
      dispatch({ type: UPDATE_ORDER, payload: data })
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const deleteOrder = async id => {
    try {
      await fetch(`${ServerDomain}/orders/${id}`, { method: 'DELETE' })
      dispatch({ type: DELETE_ORDER, payload: id })
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }
  const resetOrderState = () => {
    dispatch({ type: REST_ORDER_STATE, payload: initialState })
  }
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
        ? 10
        : state.paymentMethod === 'online'
        ? 15
        : 0
    const totalAmount = price * state.quantity + paymentCharge

    dispatch({ type: SET_DELIVERY_CHARGE, payload: paymentCharge })
    dispatch({ type: SET_TOTAL, payload: totalAmount })
  }

  const handleSubmit = (e, foodMenu, item, onClose) => {
    e.preventDefault()

    const orderDetails = {
      foodMenu,
      item,
      itemName: item.name,
      quantity: state.quantity,
      total: state.total,
      selectedSize: state.selectedSize
    }

    // console.log(orderDetails)
    handleBasketItems(orderDetails)

    // localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
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
        orders,
        searchOrderFormVisible,
        setIsSearchOrderVisible,
        getOrder,
        getOrders,
        updateOrder,
        deleteOrder,
        handleQuantityChange,
        handleSizeChange,
        calculateTotal,
        handleSubmit,
        handleRest,
        updateBasketItems,
        handleCloseBasket,
        resetOrderState,
        clearOrders
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
