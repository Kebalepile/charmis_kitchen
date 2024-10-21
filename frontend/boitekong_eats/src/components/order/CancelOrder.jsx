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
    const orderData = getStoredOrderData();

    const response = await fetch(`${ServerDomain}/purchase-order-canceled`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    clearStoredOrderData();
    return data.success;
  } catch (error) {
    console.error('Error during order cancellation:', error);
    clearStoredOrderData();
    return false;
  }
};

const CancelOrder = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const orderData = getStoredOrderData()
  const image = './assets/images/qr_code.png'

  useEffect(() => {
    const handleOrderCancellation = async () => {
      try {
        if (!orderData) {
          navigate('/404');
        } else {
          const isSuccess = await OrderCanceled();
          if (isSuccess) {
            navigate('/');
          } else {
            navigate('/failed-checkout'); // Redirect to a failure page if needed
          }
        }
      } catch (error) {
        console.error('Order cancellation error:', error);
        navigate('/failed-checkout'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };
    

    handleOrderCancellation() // Call the async function
  }, [navigate, orderData])

  // If no order data, display a message
  if (!orderData) {
    window.location.href = '/';
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
