import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredOrderData, clearStoredOrderData } from '../../utils/localStorageUtils';

const CancelOrder = () => {
    const navigate = useNavigate(); // Initialize the navigate hook
    const orderData = getStoredOrderData();
    
    if (!orderData) {
      return <p>No order data available to cancel.</p>;
    }
  
    const { newOrder } = orderData;
  
    const cancelOrder = () => {
      // Logic to cancel the order (e.g., send cancel request to server)
      console.log('Cancelling order:', newOrder.orderNumber);
      
      // Clear the order data from localStorage after cancellation
      clearStoredOrderData();
      alert(`Order ${newOrder.orderNumber} has been canceled.`);
      
      // Redirect to home URL after the order has been canceled
      navigate('/');
    };
  
    return (
      <div>
        <h1>Cancel Order</h1>
        <p>Are you sure you want to cancel order {newOrder.orderNumber}?</p>
        <button onClick={cancelOrder}>Cancel Order</button>
      </div>
    );
  };
  
  export default CancelOrder;