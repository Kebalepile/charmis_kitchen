import React, { useContext, useEffect, useState } from 'react'
import OrderContext from '../context/order/context'
import PropTypes from 'prop-types'
import Popup from './Popup'
// ND add House NUmber Address text input
const OrderForm = ({ item, onClose, menuName }) => {
  const {
    quantity,
    total,
    selectedSize,
    handleQuantityChange,
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
  }, [item, selectedSize, quantity])

  const handleFormSubmit = e => {
    e.preventDefault()
    setPopupMessage(
      "🛒 Order added to cart! Check your basket when you're done ordering."
    )
    setShowPopup(true)

    setTimeout(() => {
      handleSubmit(e, menuName, item, onClose)
    }, 3000)
  }

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

      <div>
        <form onSubmit={handleFormSubmit} className='select-order'>
          <h3>{item?.name}</h3>
          <hr className='bg-hr' />
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
            <p>
              <strong>Price: {item?.price}</strong>
            </p>
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

          <p>
            <strong>Total Amount: R{total}.00</strong>
          </p>
          <button type='submit' className='basket-btn'>
            Add to Basket
          </button>

          <button type='button' className='cancel' onClick={handleClose}>
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
