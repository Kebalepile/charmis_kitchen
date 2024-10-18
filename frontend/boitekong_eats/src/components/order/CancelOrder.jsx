import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'
import { ServerDomain } from '../../context/types'
import Spinner from '../loading/Spinner'
import './order.css'

const OrderCanceled = async () => {
  try {
    const orderData = getStoredOrderData()

    const response = await fetch(`${ServerDomain}/purchase-order-canceled`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const data = await response.json()

    if (data.success) {
      clearStoredOrderData()
      return true
    } else {
      throw new Error('Failed to send SMS')
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw error
  }
}
const CancelOrder = () => {
  const navigate = useNavigate() // Initialize the navigate hook
  const orderData = getStoredOrderData() // Get stored order data
  const image = './assets/images/qr_code.png'

  // Check if orderData exists before calling OrderCanceled
  if (!orderData) {
    // If no orderData, navigate to home after 5 seconds
    setTimeout(() => {
      navigate('/')
    }, 10000)
  } else {
    // If orderData exists, call OrderCanceled and then navigate
    OrderCanceled().then(() => {
      navigate('/')
    })
  }

  // If orderData doesn't exist, display a message
  if (!orderData) {
    return (
      <div className='redirect-container-order'>
        <h2>No order data available to cancel.</h2>
        <p>You'll be redirected to the home page in a sec...</p>
        <img alt='qr code image' src={image} className='qrcode-img' />
        {<Spinner />}
      </div>
    )
  }

  // If orderData exists, show order cancellation details
  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>Order {newOrder.orderNumber} has been canceled.</h1>
      <br />
      <p>You'll be redirected to the home page in a sec...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {<Spinner />}
    </div>
  )
}

export default CancelOrder
