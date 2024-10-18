import React, { useContext } from 'react'
import OrderContext from '../../context/order/context'
import { useNavigate } from 'react-router-dom'
import { getStoredOrderData } from '../../utils/localStorageUtils'

const CancelOrder = () => {
  const { OrderCanceled } = useContext(OrderContext)
  const navigate = useNavigate() // Initialize the navigate hook
  const orderData = getStoredOrderData()

  const { newOrder } = orderData
  OrderCanceled().then(ok => {
    if (ok) {
      // Redirect to home URL after the order has been canceled
      navigate('/')
    }
  })

  return (
    <div>
      {!orderData ? (
        <p>No order data available to cancel.</p>
      ) : (
        <>
          <h1>`Order ${newOrder.orderNumber} has been canceled.</h1>{' '}
          <p>your being redirected to home page</p>
        </>
      )}
    </div>
  )
}

export default CancelOrder
