import React, { useContext, useEffect } from 'react'
import OrderContext from '../../context/order/context'
import { useNavigate } from 'react-router-dom'
import { getStoredOrderData } from '../../utils/localStorageUtils'
import Spinner from "../loading/Spinner"
import './order.css'

const OrderSuccess = () => {
  const { SuccessfulOrderPurchase } = useContext(OrderContext)
  const navigate = useNavigate() // Initialize the navigate hook
  const orderData = getStoredOrderData() // Get stored order data
  const image = './assets/images/qr_code.png'

  // Check if orderData exists before calling the SuccessfulOrderPurchase
  useEffect(() => {
    if (!orderData) {
      // If no orderData, navigate to home after 5 seconds
      setTimeout(() => {
        navigate('/')
      }, 5000)
    } else {
      // If orderData exists, call SuccessfulOrderPurchase and then navigate
      SuccessfulOrderPurchase().then(() => {
        navigate('/')
      })
    }
  }, [orderData, SuccessfulOrderPurchase, navigate])

  // If orderData doesn't exist, display a message
  if (!orderData) {
    return (
      <div className='redirect-container-order'>
        <h2>No order data found</h2>
        <p>You'll be redirected to the home page in a sec...</p>
        <img alt='qr code image' src={image} className='qrcode-img' />
        {<Spinner/>}
      </div>
    )
  }

  // If orderData exists, show order details
  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>Order Successful</h1>
      <p>Order Number: {newOrder.orderNumber}</p>
      <p>Total Payment: R{newOrder.paymentTotal}</p>
      <br />
      <p>You'll be redirected to the home page in a sec...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {<Spinner/>}
    </div>
  )
}

export default OrderSuccess
