import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'
import { ServerDomain } from '../../context/types'
import Spinner from '../loading/Spinner'
import './order.css'

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

const SuccessfulOrderPurchase = async () => {
  try {
    const orderData = getStoredOrderData()

    const response = await fetch(`${ServerDomain}/checkout-successful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const data = await response.json()

    if (data.success) {
      const {
        customerPhone,
        customerMessage,
        cookPhones,
        cookMessage,
        supportPhones,
        supportMessage
      } = data
      const promises = []
      const customerPromise = sendSms(customerPhone, customerMessage)

      const cookPromises = cookPhones.map(phone => sendSms(phone, cookMessage))
      const supportPromises = supportPhones.map(phone =>
        sendSms(phone, supportMessage)
      )
      promises.push(customerPromise, ...cookPromises, ...supportPromises)

      await Promise.all(promises)

      clearStoredOrderData()
      return true
    } else {
      clearStoredOrderData()
      throw new Error('Failed to send SMS')
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw error
  }
}

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [orderProcessed, setOrderProcessed] = useState(false)
  const orderData = getStoredOrderData()
  const image = './assets/images/qr_code.png'

  if (!orderProcessed) {
    setTimeout(async () => {
      try {
        if (!orderData) {
          navigate('/404')
        } else {
          const done = await SuccessfulOrderPurchase()
          if (done) {
            setOrderProcessed(true)
            localStorage.setItem('submitted', true)
            navigate('/')
          }
        }
      } catch (error) {
        console.error('Order processing error:', error)
      } finally {
        setLoading(false)
      }
    }, 7000)
  }

  if (!orderData) {
    return null
  }

  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>Order Successful</h1>
      <p>Order Number: {newOrder.orderNumber}</p>
      <p>Total Payment: R{newOrder.paymentTotal}</p>
      <br />
      <p>You will be redirected to the home page in a sec...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />}
    </div>
  )
}

export default OrderSuccess
