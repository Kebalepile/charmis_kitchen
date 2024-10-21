import React, { useState, useEffect } from 'react';
import {
  getStoredOrderData,
  clearStoredOrderData,
} from '../../utils/localStorageUtils';
import { ServerDomain } from '../../context/types';
import Spinner from '../loading/Spinner';
import './order.css';

// Send SMS function
const sendSms = async (phone, message) => {
  try {
    const response = await fetch(`${ServerDomain}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phone, message }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error('Failed to send SMS');
    }
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Handle successful order purchase
const SuccessfulOrderPurchase = async () => {
  try {
    const orderData = getStoredOrderData();
    if (!orderData) throw new Error('No order data available');

    const response = await fetch(`${ServerDomain}/checkout-successful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error('Failed to complete order');
    }

    const {
      customerPhone,
      customerMessage,
      cookPhones,
      cookMessage,
      supportPhones,
      supportMessage,
    } = data;

    // Send SMS to customer, cooks, and support team
    await sendSms(customerPhone, customerMessage);
    for (const phone of cookPhones) await sendSms(phone, cookMessage);
    for (const phone of supportPhones) await sendSms(phone, supportMessage);

    // Clear stored order data on successful purchase
    clearStoredOrderData();
    return true;
  } catch (error) {
    console.error('Error in SuccessfulOrderPurchase:', error);
    clearStoredOrderData(); // Always clear the data even in failure cases
    return false;
  }
};

const OrderSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const orderData = getStoredOrderData();
  const image = './assets/images/qr_code.png';

  useEffect(() => {
    const handleOrderProcessing = async () => {
      try {
        if (!orderData) {
          window.location.href = '/';
        } else {
          const success = await SuccessfulOrderPurchase();
          if (success) {
            setOrderProcessed(true);
            localStorage.setItem('submitted', true);
            setTimeout(() => {
              window.location.href = '/'; // Delay redirect to home
            }, 3000); // Redirect after 3 seconds
          } else {
            window.location.href = '/failed-checkout'; // Redirect to failure page
          }
        }
      } catch (error) {
        console.error('Order processing error:', error);
        window.location.href = '/failed-checkout';
      } finally {
        setLoading(false);
      }
    };

    handleOrderProcessing();
  }, [orderData]);

  // If no order data exists, do not render anything
  if (!orderData) return null;

  const { newOrder } = orderData;

  return (
    <div className='redirect-container-order'>
      <h1>Order Successful</h1>
      <p>Order Number: {newOrder.orderNumber}</p>
      <p>Total Payment: R{newOrder.paymentTotal}</p>
      <br />
      <p>You will be redirected to the home page shortly...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />}
    </div>
  );
};

export default OrderSuccess;
