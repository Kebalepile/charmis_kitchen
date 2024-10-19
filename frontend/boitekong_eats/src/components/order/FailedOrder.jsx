import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'
import { ServerDomain } from '../../context/types'
import Spinner from '../loading/Spinner'
import './order.css'

const CheckoutFailure = async () => {
  try {
    const orderData = getStoredOrderData()

    const response = await fetch(`${ServerDomain}/checkout-failure`, {
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

const FailedOrder = () => {
  const navigate = useNavigate() // Initialize the navigate hook
  const [loading, setLoading] = useState(true) // Add loading state
  const orderData = getStoredOrderData() // Get stored order data
  const image = './assets/images/qr_code.png'

  useEffect(() => {
    const handleOrderFailure = async () => {
      try {
        if (!orderData) {
          // No order data, navigate to 404
          navigate('/404')
        } else {
          // Await the checkout failure process
          await CheckoutFailure()
          navigate('/')
        }
      } catch (error) {
        console.error('Order failure error:', error)
      } finally {
        setLoading(false) // Stop loading after the process is complete
      }
    }

    handleOrderFailure() // Call the async function
  }, [navigate, orderData])

  // If no order data, render nothing or you could redirect to a 404 or home page
  if (!orderData) {
    return null
  }

  // If order data exists, display failure details
  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>😔 Oops! Order Failed</h1>
      <p>Unfortunately, we could not process your order right now.</p>
      <p>
        Order Number: <strong>{newOrder.orderNumber}</strong>
      </p>
      <p>Total Payment: R{newOrder.paymentTotal}</p>
      <p>
        Please try again later. We’re sorry for the inconvenience! 🙏
        <br />
        If the problem persists, contact our support team at:{' '}
        <strong>{newOrder.supportPhone}</strong>
      </p>
      <p>Thank you for your patience! 💙</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />} {/* Show spinner while loading */}
    </div>
  )
}

export default FailedOrder
