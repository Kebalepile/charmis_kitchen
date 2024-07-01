import React, { useContext, useState, useEffect, useRef } from 'react';
import OrderContext from '../context/order/context';

const OrderDisplay = () => {
  const { orders, clearOrders } = useContext(OrderContext);
  const [isVisible, setIsVisible] = useState(true);
  const dialogRef = useRef(null);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      clearOrders();
    }
  }, [isVisible, orders, clearOrders]);

  useEffect(() => {
    if (dialogRef.current) {
      if (isVisible) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <dialog ref={dialogRef} className="order-dialog">
      <button onClick={handleClose} className="menu-btn">Close</button>
      <div className="order-details">
        {orders.map((order) => (
          <div key={order.orderNumber} className="order-item">
            {order.orderNumber && <p><strong>Order Number:</strong> {order.orderNumber}</p>}
            {order.name && <p><strong>Name:</strong> {order.name}</p>}
            {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
            {order.streetAddress && <p><strong>Street Address:</strong> {order.streetAddress}</p>}
            {order.houseNumber && <p><strong>House Number:</strong> {order.houseNumber}</p>}
            {order.paymentMethod && <p><strong>Payment Method:</strong> {order.paymentMethod}</p>}
            {order.paymentTotal !== undefined && <p><strong>Payment Total:</strong> ${order.paymentTotal.toFixed(2)}</p>}
            {order.deliveryCharge !== undefined && <p><strong>Delivery Charge:</strong> ${order.deliveryCharge.toFixed(2)}</p>}
            {order.paymentItemsDescriptions && <p><strong>Items:</strong> {order.paymentItemsDescriptions}</p>}
            {order.status && <p><strong>Status:</strong> {order.status}</p>}
            {order.timestamp && <p><strong>Timestamp:</strong> {new Date(order.timestamp).toLocaleString()}</p>}
          </div>
        ))}
      </div>
    </dialog>
  );
};

export default OrderDisplay;
