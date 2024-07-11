import React, { useContext, useState, useEffect, useRef } from 'react'
import OrderContext from '../context/order/context'

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
                <strong>Order Number: </strong> <i>{order.orderNumber}</i>
              </p>
            )}
            {order.name && (
              <p>
                <strong>Name: </strong>
                <i>{order.name}</i>
              </p>
            )}
            {order.phone && (
              <p>
                <strong>Phone: </strong>{' '}
                <i>{`***-*-${order.phone.slice(-4)}`}</i>
              </p>
            )}
            {order.streetAddress && (
              <p>
                <strong>Street Address: </strong> <i>{order.streetAddress}</i>
              </p>
            )}
            {order.houseNumber && (
              <p>
                <strong>House Number: </strong> <i>{order.houseNumber}</i>
              </p>
            )}
            {order.paymentMethod && (
              <p>
                <strong>Payment Method: </strong> <i>{order.paymentMethod}</i>
              </p>
            )}
            {order.paymentTotal !== undefined && (
              <p>
                <strong>Payment Total: </strong>{' '}
                <i>R {order.paymentTotal.toFixed(2)}</i>
              </p>
            )}
            {order.deliveryCharge !== undefined && (
              <p>
                <strong>Delivery Charge: </strong>{' '}
                <i>R {order.deliveryCharge.toFixed(2)}</i>
              </p>
            )}
            {order.paymentItemsDescriptions && (
              <p>
                <strong>Items: </strong> <i>{order.paymentItemsDescriptions}</i>
              </p>
            )}
            {order.status && (
              <p>
                <strong>Status: </strong> <i>{order.status}</i>
              </p>
            )}
            {order.timestamp && (
              <p>
                <strong>Timestamp: </strong>{' '}
                <i>{new Date(order.timestamp).toLocaleString()}</i>
              </p>
            )}
          </div>
        ))}
      </div>
    </dialog>
  )
}

export default OrderDisplay
