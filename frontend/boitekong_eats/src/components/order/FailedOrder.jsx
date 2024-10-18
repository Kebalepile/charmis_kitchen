import React, { useContext } from 'react'
import OrderContext from '../../context/order/context'
import { useNavigate } from 'react-router-dom'
import { getStoredOrderData } from '../../utils/localStorageUtils'

const FailedOrder = () => {
  const { CheckoutFailure } = useContext(OrderContext)
  const navigate = useNavigate() // Initialize the navigate hook
  const orderData = getStoredOrderData()

  const { newOrder } = orderData
  CheckoutFailure().then(ok => {
    if (ok) {
      // Redirect to home URL after the order has been canceled

      navigate('/')
    }
  })
  return (
    <div>
      {!orderData ? (
        <p>No order data found.</p>
      ) : (
        <>
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
          {/* Optionally, you can add a button to retry the order */}
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px', marginTop: '10px' }}
          >
            Try Again 🔄
          </button>
        </>
      )}
    </div>
  )
}

export default FailedOrder
