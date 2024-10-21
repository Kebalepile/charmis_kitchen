import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils';
import { ServerDomain } from '../../context/types';
import Spinner from '../loading/Spinner';
import './order.css';

// This function is no longer async at the component level, async logic is handled internally
const handleCheckoutFailure = async () => {
  try {
    const orderData = getStoredOrderData();
    if (!orderData) {
      throw new Error('No order data available');
    }

    const response = await fetch(`${ServerDomain}/checkout-failure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    if (data.success) {
      // Clear the stored order data if the failure was processed successfully
      clearStoredOrderData();
      return true;
    } else {
      throw new Error('Failed to process checkout failure');
    }
  } catch (error) {
    console.error('Error processing checkout failure:', error);
    throw error;
  }
};

const FailedOrder = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [loading, setLoading] = useState(true); // Add loading state
  const [failureProcessed, setFailureProcessed] = useState(false); // To track if the process is done
  const orderData = getStoredOrderData(); // Get stored order data
  const image = './assets/images/qr_code.png';

  useEffect(() => {
    const processCheckoutFailure = async () => {
      try {
        if (!orderData) {
          // No order data, navigate to 404
          navigate('/404');
          return;
        }

        // Await the checkout failure process
        const success = await handleCheckoutFailure();
        if (success) {
          setFailureProcessed(true);
          setTimeout(() => {
            navigate('/'); // Redirect to home page after a few seconds
          }, 5000); // Adjust the timeout as needed (5 seconds in this case)
        }
      } catch (error) {
        console.error('Order failure error:', error);
        // Optionally, redirect to a failure page
        navigate('/failed-cancellation');
      } finally {
        setLoading(false); // Stop loading after the process is complete
      }
    };

    processCheckoutFailure(); // Call the async function
  }, [navigate, orderData]);

  // If no order data is found, do not render the component
  if (!orderData) {
    return null;
  }

  // If order data exists, display failure details
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
      <img alt='qr code image' src={image} className='qrcode-img' />
      {loading && <Spinner />} {/* Show spinner while loading */}
      {failureProcessed && (
        <p className='redirect-message'>Redirecting to home page in a moment...</p>
      )}
    </div>
  );
};

export default FailedOrder;
