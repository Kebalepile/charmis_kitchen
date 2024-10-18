import React, { useContext } from 'react'
import OrderContext from '../../context/order/context'
import { useNavigate } from 'react-router-dom'
import { getStoredOrderData } from '../../utils/localStorageUtils'

const OrderSuccess = () => {
  const { SuccessfulOrderPurchase } = useContext(OrderContext)
  const navigate = useNavigate() // Initialize the navigate hook
  const orderData = getStoredOrderData()
  const { newOrder } = orderData
  SuccessfulOrderPurchase().then(ok => {
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
          <h1>Order Successful</h1>
          <p>Order Number: {newOrder.orderNumber}</p>
          <p>Total Payment: R{newOrder.paymentTotal}</p>
        </>
      )}{' '}
    </div>
  )
}

export default OrderSuccess
