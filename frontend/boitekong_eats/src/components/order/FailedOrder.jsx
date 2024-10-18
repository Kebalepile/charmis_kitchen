import React from 'react'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'

const FailedOrder = () => {
  const orderData = getStoredOrderData()

  if (!orderData) {
    return <p>No order data found.</p>
  }

  const { newOrder } = orderData
  //   clear locastoragte data,
  // send alert to server to delete temp stored data
  // redirect to home after

  return (
    <div>
      <h1>😔 Oops! Order Failed</h1>
      <p>Unfortunately, we couldn't process your order right now.</p>
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
      {/* Optionally, you can add a button to retry the order */}
      <button
        onClick={() => window.location.reload()}
        style={{ padding: '10px', marginTop: '10px' }}
      >
        Try Again 🔄
      </button>
    </div>
  )
}

export default FailedOrder
