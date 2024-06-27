import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PaymentContext from '../context/payment/context'
import Popup from './Popup'

const PaymentForm = ({ setShowPaymentForm, paymentItems }) => {
  const {
    name,
    phone,
    paymentMethod,
    deliveryCharge,
    paymentTotal,
    streetAddress,
    houseNumber,
    handleNameChange,
    handlePhoneChange,
    handlePaymentChange,
    handlePaymentItems,
    handleHouseNumbersChange,
    handleStreetAddressChange
  } = useContext(PaymentContext)

  useEffect(() => {
    handlePaymentItems(paymentItems)
  }, [paymentItems, handlePaymentItems])

 
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const validateForm = () => {
    const phoneRegex = /^0[0-9]{9}$/
    const nameRegex = /^[a-zA-Z\s]+$/

    if (!phone.match(phoneRegex)) {
      setPopupMessage('📞 Phone number must be 10 digits and start with 0.')
      setShowPopup(true)
      return false
    }

    if (!name.trim() || !name.match(nameRegex)) {
      setPopupMessage(
        '👤 Name must not be empty, contain only spaces, and should only include word characters.'
      )
      setShowPopup(true)
      return false
    }

    // Additional validation logic as needed

    return true
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted')
      // Reset form if needed
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }

  const handleCloseFrom = () => {
    console.log('close payment form')
    setShowPaymentForm(false)
  }
  const renderAddressInputs = () => {
    if (paymentMethod === 'self-collect') {
      return null // Render nothing if self-collect
    }

    return (
      <div>
        <div className='form-group'>
          <label>
            Street Address:
            <input
              type='text'
              value={streetAddress}
              onChange={handleStreetAddressChange}
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            House Number:
            <input
              type='text'
              value={houseNumber}
              onChange={handleHouseNumbersChange}
              required
            />
          </label>
        </div>
      </div>
    )
  }

  return (
    <div id='payment-form'>
      <div className='overlay show' onClick={handleCloseFrom}></div>
      <div className='payment-details'>
        <form onSubmit={handleFormSubmit}>
          <div className='form-group'>
            <h3>Payment details</h3>
            <hr className='bg-hr' />
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
              <select
                className='select-payment'
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <option value='self-collect'>Self Collect (Free)</option>
                <option value='online-self-collect'>
                  Online Payment + Self Collect (Free)
                </option>
                <option value='cash'>Cash on Delivery (+R20.00)</option>
                <option value='online'>Online Payment (+R15.00)</option>
              </select>
            </label>
          </div>
          <p>
            Total Delivery Charge: <strong>R{deliveryCharge}.00</strong>
          </p>
          <p>
            Required Payment Total:
            <strong> R{paymentTotal + deliveryCharge}</strong>
          </p>

          {renderAddressInputs()}

          <button type='submit' className='basket-btn'>
            Pay
          </button>

          <button type='button' className='cancel' onClick={handleCloseFrom}>
            Cancel
          </button>
        </form>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  )
}

PaymentForm.propTypes = {
  setShowPaymentForm: PropTypes.func.isRequired,
  paymentItems: PropTypes.array.isRequired
}
export default PaymentForm
