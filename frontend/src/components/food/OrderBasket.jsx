import React, { useState } from 'react'
import PropTypes from 'prop-types'
import PaymentForm from '../PaymentForm'

const OrderBasket = ({ basketItems, updateBasketItems,
  resetToInitialState
 }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const removeOrder = (index, arr) => {
    // Create a copy of the array to avoid mutating the original array
    const updatedArr = [...arr]

    // Check if the index is within the valid range
    if (index >= 0 && index < updatedArr.length) {
      // Remove the item at the given index
      updatedArr.splice(index, 1)
    }
    updateBasketItems(updatedArr)
  }

  const handlePaymentType = () => {
    console.log(
      'load form to filll payment details and select payment type, calculate amount needed to pay'
    )
    console.log('order basket button clicked')
    setShowPaymentForm(true)
  }

  const total = () => {
    return basketItems.reduce((acc, cur) => {
      acc += cur.total
      return acc
    }, 0)
  }

  return (
    <>
      {showPaymentForm && (
        <PaymentForm
          setShowPaymentForm={setShowPaymentForm}
          paymentItems={basketItems}
          resetToInitialState={resetToInitialState}
        />
      )}
      <section className='order-basket'>
        <h3>Pending orders</h3>
        <button className='menu-btn pay-button' onClick={handlePaymentType}>
          pay
        </button>
        <hr className='bg-hr' />
        <p>Total Amount to be paid is: R{total()}</p>
        <hr className='bg-hr' />
        {basketItems.map((order, index) => (
          <article key={index} className='order-item'>
            <p> order number: {order.orderNumber}</p>
            <p> meal: {order.itemName}</p>
            <p> number of meal ordered: {order.quantity}</p>
            {order.selectedSize.length > 0 && (
              <p> meal size: {order.selectedSize}</p>
            )}
            <p> total: R{order.total}</p>
            <button
              className='pop'
              onClick={() => removeOrder(index, basketItems)}
            >
              remove
            </button>
          </article>
        ))}
      </section>
    </>
  )
}

OrderBasket.propTypes = {
  basketItems: PropTypes.array.isRequired,
  updateBasketItems: PropTypes.func.isRequired,
  resetToInitialState: PropTypes.func.isRequired
}

export default OrderBasket
