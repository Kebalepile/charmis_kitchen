import React from 'react';
import { getStoredOrderData, clearStoredOrderData } from '../../utils/localStorageUtils';


const OrderSuccess = () => {
    const orderData = getStoredOrderData();
  
    if (!orderData) {
      return <p>No order data found.</p>;
    }
  
    const { newOrder } = orderData;
  
    return (
      <div>
        <h1>Order Successful</h1>
        <p>Order Number: {newOrder.orderNumber}</p>
        <p>Total Payment: R{newOrder.paymentTotal}</p>
        {/* You can display more order details here as needed */}
      </div>
    );
  };
  
  export default OrderSuccess;