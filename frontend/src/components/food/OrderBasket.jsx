import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PaymentForm from '../PaymentForm';

const OrderBasket = ({ basketItems, updateBasketItems, resetOrderState }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const removeOrder = (index, arr) => {
    const updatedArr = [...arr];
    if (index >= 0 && index < updatedArr.length) {
      updatedArr.splice(index, 1);
    }
    updateBasketItems(updatedArr);
  };

  const handlePaymentType = () => {
    console.log(
      'load form to fill payment details and select payment type, calculate amount needed to pay'
    );
    setShowPaymentForm(true);
  };

  const total = () => {
    return basketItems.reduce((acc, cur) => {
      acc += cur.total;
      return acc;
    }, 0);
  };

  return (
    <>
      {showPaymentForm && (
        <PaymentForm
          setShowPaymentForm={setShowPaymentForm}
          paymentItems={basketItems}
          resetOrderState={resetOrderState}
        />
      )}
      <section className='order-basket'>
        <div className="sticky-top">
          <h3>Pending orders</h3>
          <button className='menu-btn checkout-button' onClick={handlePaymentType}>
          <span>Checkout</span>  🛒
          </button>
          <hr className='bg-hr' />
          <p className='total-amount'>
            Total Amount to be paid is:<strong> R {total()}.00</strong>
          </p>
          <hr className='bg-hr' />
        </div>
        {basketItems.map((order, index) => (
            <article key={index} className='order-item'>
              <img className="order-img" src={order.item.image_url} alt={order.item.alt} />
              <p className='order-total'>Total: R{order.total}</p>
              <p className='order-quantity'>Quantity: {order.quantity}</p>
              {order.selectedSize.length > 0 && (
                <p className='order-size'>Size: {order.selectedSize}</p>
              )}
              <p className='order-name'>{order.itemName}</p>
              <button
                className='pop'
                onClick={() => removeOrder(index, basketItems)}
              >
                X
              </button>
            </article>
          ))}
      </section>
    </>
  );
};

OrderBasket.propTypes = {
  basketItems: PropTypes.array.isRequired,
  updateBasketItems: PropTypes.func.isRequired,
  resetOrderState: PropTypes.func.isRequired
};

export default OrderBasket;
