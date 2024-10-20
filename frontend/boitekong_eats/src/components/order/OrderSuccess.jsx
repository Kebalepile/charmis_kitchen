import React, { useState } from 'react'
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
    const orderData = getStoredOrderData();
    console.log('order data');
    console.log(orderData);

    const response = await fetch(`${ServerDomain}/checkout-successful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      const {
        customerPhone,
        customerMessage,
        cookPhones,
        cookMessage,
        supportPhones,
        supportMessage,
      } = data;

      // Send SMS to the customer
      let ok = await sendSms(customerPhone, customerMessage);
      console.log('Customer SMS sent:', ok);

      // Send SMS to all cooks
      for (const phone of cookPhones) {
        ok = await sendSms(phone, cookMessage);
        console.log('Cook SMS sent:', ok);
      }

      // Send SMS to all support phones
      for (const phone of supportPhones) {
        ok = await sendSms(phone, supportMessage);
        console.log('Support SMS sent:', ok);
      }

      // Clear the stored order data after successful SMS sending
      clearStoredOrderData();
      return true;
    } else {
      clearStoredOrderData();
      throw new Error('Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};


const OrderSuccess = () => {
  const [loading, setLoading] = useState(true)
  const [orderProcessed, setOrderProcessed] = useState(false)
  const orderData = getStoredOrderData()
  const image = './assets/images/qr_code.png'

  if (!orderProcessed) {
    setTimeout(async () => {
      try {
        if (!orderData) {
          window.location.href = '/'
        } else {
          const done = await SuccessfulOrderPurchase()
          if (done) {
            setOrderProcessed(true)
            localStorage.setItem('submitted', true)
            window.location.href = '/'
          }
        }
      } catch (error) {
        console.error('Order processing error:', error)
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
