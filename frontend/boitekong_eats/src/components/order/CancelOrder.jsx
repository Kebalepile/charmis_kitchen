import React, { useEffect, useState } from 'react'
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
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const orderData = getStoredOrderData()
  const image = './assets/images/qr_code.png'

  useEffect(() => {
    const handleOrderCancellation = async () => {
      try {
        if (!orderData) {
          // No order data, navigate back to home immediately
          navigate('/404')
        } else {
          // Await the cancellation process
          await OrderCanceled()
          navigate('/')
        }
      } catch (error) {
        console.error('Order cancellation error:', error)
      } finally {
        setLoading(false) // Stop loading after the process is complete
      }
    }

    handleOrderCancellation() // Call the async function
  }, [navigate, orderData])

  // If no order data, display a message
  if (!orderData) {
    return null
  }

  // If order data exists, display cancellation details
  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>Order {newOrder.orderNumber} has been canceled.</h1>
      <br />
      <p>You'll be redirected to the home page.</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />}
    </div>
  )
}

export default CancelOrder
