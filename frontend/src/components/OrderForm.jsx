import React, { useContext, useEffect } from 'react';
import OrderContext from '../context/order/context';
import PropTypes from 'prop-types';

const OrderForm = ({ item, onClose, menuName }) => {
  const {
    quantity,
    name,
    phone,
    paymentMethod,
    deliveryCharge,
    total,
    selectedSize,
    handleQuantityChange,
    handleNameChange,
    handlePhoneChange,
    handlePaymentChange,
    handleSizeChange,
    calculateTotal,
    handleSubmit,
  } = useContext(OrderContext);

  useEffect(() => {
    if (item && (item.price || (item.prices && selectedSize))) {
      calculateTotal(item);
    }
  }, [item, quantity, paymentMethod, selectedSize]);

  return (
    <div>
      <div id='read-menu'>
        <h2>Order {item?.name}</h2>
        <hr className='bg-hr' />
        <form onSubmit={(e) => handleSubmit(e, menuName,item, onClose)}>
          {item?.prices ? (
            <div>
              <label>Select Size:</label>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
              >
                <option value=''>Select Size</option>
                {Object.entries(item.prices).map(([size, price]) => (
                  <option key={size} value={size}>
                    {size} - {price}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>Price: {item?.price}</p>
          )}
          <label>
            Quantity:
            <input
              type='number'
              value={isNaN(quantity) ? '' : quantity}
              onChange={handleQuantityChange}
              min='1'
              required
            />
          </label>
          <label>
            Name:
            <input
              type='text'
              value={name}
              onChange={handleNameChange}
              required
            />
          </label>
          <label>
            Phone (RSA only):
            <input
              type='tel'
              value={phone}
              onChange={handlePhoneChange}
              pattern='[0-9]{10}'
              required
            />
          </label>
          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={handlePaymentChange}
            >
              <option value='self-collect'>
                Self Collect (Free)
              </option>
              <option value='online-self-collect'>
                Online Payment + Self Collect (Free)
              </option>
              <option value='cash'>
                Cash on Delivery (+R20.00)
              </option>
              <option value='online'>
                Online Payment (+R15.00)
              </option>
            </select>
          </label>
          <p>
            Total Delivery Charge: R{deliveryCharge}.00
          </p>
          <p>Total Amount: R{total}.00</p>
          <button type='submit'>Submit Order</button>
          <br />
          <button type='button' onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

OrderForm.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default OrderForm;
