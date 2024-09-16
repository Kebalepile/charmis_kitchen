import React, { useContext, useState, useEffect, useRef } from 'react'
import OrderContext from '../../context/order/context'

import './order.css'
const OrderDisplay = () => {
  const { orders, clearOrders } = useContext(OrderContext)
  const [isVisible, setIsVisible] = useState(true)
  const dialogRef = useRef(null)

  const handleClose = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!isVisible) {
      clearOrders()
    }
  }, [isVisible, orders, clearOrders])

  useEffect(() => {
    if (dialogRef.current) {
      if (isVisible) {
        dialogRef.current.showModal()
      } else {
        dialogRef.current.close()
      }
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <dialog ref={dialogRef} className='order-dialog'>
      <button onClick={handleClose} className='order-display-close-button'>
        X
      </button>
      <div className='order-details'>
        {orders.map((order, index) => (
          <div key={index} className='order-display-details'>
            {order.orderNumber && (
              <p>
                <strong>Order Number: </strong> {order.orderNumber}
              </p>
            )}
            {order.name && (
              <p>
                <strong>Name: </strong>
                {order.name}
              </p>
            )}
            {order.phone && (
              <p>
                <strong>Phone: </strong>{' '}
                {`***-*-${order.phone.slice(-4)}`}
              </p>
            )}
            {order.streetAddress && (
              <p>
                <strong>Street Address: </strong> {order.streetAddress}
              </p>
            )}
            {order.houseNumber && (
              <p>
                <strong>House Number: </strong> {order.houseNumber}
              </p>
            )}
            {order.paymentMethod && (
              <p>
                <strong>Payment Method: </strong> {order.paymentMethod}
              </p>
            )}
            {order.paymentTotal !== undefined && (
              <p>
                <strong>Payment Total: </strong>{' '}
                R {order.paymentTotal.toFixed(2)}
              </p>
            )}
            {order.deliveryCharge !== undefined && (
              <p>
                <strong>Delivery Charge: </strong>{' '}
                R {order.deliveryCharge.toFixed(2)}
              </p>
            )}
            {order.paymentItemsDescriptions && (
              <p>
                <strong>Items: </strong> {order.paymentItemsDescriptions}
              </p>
            )}
            {order.status && (
              <p>
                <strong>Status: </strong> {order.status}
              </p>
            )}
            {order.timestamp && (
              <p>
                <strong>Timestamp: </strong>{' '}
                {new Date(order.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </dialog>
  )
}

export default OrderDisplay
