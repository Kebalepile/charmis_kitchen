import React, { useContext, useEffect } from 'react';
import OrderContext from '../../context/order/context';
import { useNavigate } from 'react-router-dom';
import { getStoredOrderData } from '../../utils/localStorageUtils';
import Spinner from "../loading/Spinner"
import './order.css';

const FailedOrder = () => {
  const { CheckoutFailure } = useContext(OrderContext);
  const navigate = useNavigate(); // Initialize the navigate hook
  const orderData = getStoredOrderData(); // Get stored order data
  const image = './assets/images/qr_code.png';

  // Check if orderData exists before calling CheckoutFailure
  useEffect(() => {
    if (!orderData) {
      // If no orderData, navigate to home after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } else {
      // If orderData exists, call CheckoutFailure and then navigate
      CheckoutFailure().then(() => {
        navigate('/');
      });
    }
  }, [orderData, CheckoutFailure, navigate]);

  // If orderData doesn't exist, display a message
  if (!orderData) {
    return (
      <div className='redirect-container-order'>
        <h2>No order data available.</h2>
        <p>You'll be redirected to the home page in a sec...</p>
        <img alt='qr code image' src={image} className='qrcode-img' />
        {<Spinner/>}
      </div>
    );
  }

  // If orderData exists, show order failure details
  const { newOrder } = orderData;

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
      <p>You'll be redirected to the home page in a sec...</p>
      <img alt='qr code image' src={image} className='qrcode-img' />
      {<Spinner/>}
    </div>
  );
};

export default FailedOrder;
