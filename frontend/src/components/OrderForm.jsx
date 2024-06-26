import React, { useContext, useEffect, useState } from 'react'
import OrderContext from '../context/order/context'
import PropTypes from 'prop-types'
import Popup from './Popup'
// ND add House NUmber Address text input
const OrderForm = ({ item, onClose, menuName }) => {
  const {
    quantity,
    // name,
    // phone,
    // paymentMethod,
    // deliveryCharge,
    total,
    selectedSize,
    handleQuantityChange,
    // handleNameChange,
    // handlePhoneChange,
    // handlePaymentChange,
    handleSizeChange,
    calculateTotal,
    handleSubmit,
    handleRest
  } = useContext(OrderContext)

  const [quantityInput, setQuantityInput] = useState(quantity)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  

  useEffect(() => {
    if (item && (item.price || (item.prices && selectedSize))) {
      calculateTotal(item)
    }
   
  }, [item, selectedSize, quantity /**, quantity, paymentMethod, */])

 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setPopupMessage("🛒 Order added to basket! Check your basket when you're done ordering.");
    setShowPopup(true);
   
    setTimeout(() => {
      handleSubmit(e, menuName, item, onClose);
    }, 9000)
  };

  const handleQuantityInputChange = e => {
    const value = e.target.value
    setQuantityInput(value)
    handleQuantityChange(e)
  }

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }
  const handleClose = () => {
    handleRest()
    onClose()
  }

  return (
    <div id='price-form'>
      <div className='overlay show' onClick={handleClose}></div>
      <div className='order-form'>
        <h2>Order {item?.name}</h2>
        <hr className='bg-hr' />
        <form onSubmit={handleFormSubmit} className='order-form'>
          {item?.prices ? (
            <div className='form-group size-select'>
              <label>Select Size:</label>
              <select value={selectedSize} onChange={handleSizeChange} required>
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
          <div className='form-group'>
            <label>
              Quantity:
              <input
                type='number'
                value={quantityInput}
                onChange={handleQuantityInputChange}
                min='1'
                max='25'
                placeholder='1'
                required
              />
            </label>
          </div>
          {/* <div className='form-group'>
            <label>
              Name:
              <input
                type='text'
                value={name}
                onChange={handleNameChange}
                required
              />
            </label>
          </div>
          <div className='form-group'>
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
          </div>
          <div className='form-group'>
            <label>
              Payment Method:
              <select className="select-payment" value={paymentMethod} onChange={handlePaymentChange}>
                <option value='self-collect'>Self Collect (Free)</option>
                <option value='online-self-collect'>
                  Online Payment + Self Collect (Free)
                </option>
                <option value='cash'>Cash on Delivery (+R20.00)</option>
                <option value='online'>Online Payment (+R15.00)</option>
              </select>
            </label>
          </div>
          <p>Total Delivery Charge: R{deliveryCharge}.00</p> */}
          <p>Total Amount: R{total}.00</p>
          <button type='submit' className='basket-btn'>
            Add to Basket
          </button>
          {/* <br /> */}
          <button
            type='button'
            className='cancel'
            onClick={handleClose}
          >
            Cancel
          </button>
        </form>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  )
}

OrderForm.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  menuName: PropTypes.string.isRequired
}

export default OrderForm
