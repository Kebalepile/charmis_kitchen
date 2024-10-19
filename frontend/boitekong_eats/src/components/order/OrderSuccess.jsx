import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'
import { ServerDomain } from '../../context/types'
import Spinner from '../loading/Spinner'
import './order.css'

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
    // {
    //   success: true,
    //   supportPhones: supportPhones.map(phone => formatCellNumber(phone)),
    //   cookPhones: cookPhones.map(phone => formatCellNumber(phone)),
    //   customerPhone: formatCellNumber(phone),
    //   cookMessage: `New order at Boitekong Eats: ${orderNumber}, ${name}, ${phone}, ${paymentItemsDescriptions}`,
    //   supportMessage: `New order at Boitekong Eats ready for process order number ${orderNumber}`,
    //   customerMessage: `Hi ${name}, your order is being processed at BoitekongEats. You'll be notified via SMS when the order is ready. Track your order ${orderNumber} on the web-app.`,
    //   message: "Order updated and notifications sent successfully!"
    // }

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
      promises.push(customerPromise)
      const cookPromises = cookPhones.map(phone => sendSms(phone, cookMessage))
      const supportPromises = supportPhones.map(phone =>
        sendSms(phone, supportMessage)
      )
      promises.push(...supportPromises, ...cookPromises)
      // Wait for all promises to resolve
      console.log(promises)
      await Promise.all(promises)

      // return boolean  returned from sendsms
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
  const orderData = getStoredOrderData()
  const image = './assets/images/qr_code.png'

  useEffect(() => {
    // Define an async function inside useEffect
    const handleOrderSuccess = async () => {
      try {
        if (!orderData) {
          // If no orderData, navigate back to home
          navigate('/404')
        } else {
          // Await the successful order purchase before navigating
          const done = await SuccessfulOrderPurchase()
          if (done) {
            navigate('/')
          }
        }
      } catch (error) {
        console.error('Order processing error:', error)
      } finally {
        setLoading(false) // Stop loading after the process is done
      }
    }

    handleOrderSuccess() // Call the async function
  }, [navigate, orderData])

  // If orderData doesn't exist, display a message
  if (!orderData) {
    return null
  }

  // If orderData exists, show order details
  const { newOrder } = orderData

  return (
    <div className='redirect-container-order'>
      <h1>Order Successful</h1>
      <p>Order Number: {newOrder.orderNumber}</p>
      <p>Total Payment: R{newOrder.paymentTotal}</p>
      <br />
      <p>You wll be redirected to the home page in a sec...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />}
    </div>
  )
}

export default OrderSuccess
