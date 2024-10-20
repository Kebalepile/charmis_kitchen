import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PaymentContext from '../../context/payment/context'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import termsAndConditions from '../../assets/policies/termsAndConditions'

import './payment.css'

const PaymentForm = ({ setShowPaymentForm, paymentItems, resetOrderState }) => {
  const {
    name = '',
    phone = '',
    paymentMethod,
    deliveryCharge,
    paymentTotal,
    orderNumber,
    streetAddress = '',
    houseNumber = '',
    handleNameChange,
    handlePhoneChange,
    handlePaymentChange,
    handlePaymentItems,
    handleHouseNumbersChange,
    handleStreetAddressChange,
    handleSubmitOrder,
    resetPaymentState,
    initOrderNumber,
    initOrderDetails,
    paymentGatewayOpen,
    handleDeliveryChargeChange
  } = useContext(PaymentContext)

  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isDeliveryChecked, setIsDeliveryChecked] = useState(false) // Track checkbox state

  const onlinePaymentIsRequired = paymentTotal => {
    return paymentTotal > 200 ? true : false
  }

  const handlePaymentGateway = () => {
    initOrderDetails()
    setLoading(true)
    paymentGatewayOpen()
    setTimeout(() => {
      resetOrderState()
      const done = resetPaymentState()

      if (done) {
        setLoading(false)
        setShowPaymentForm(false)
      }
    }, 7000)
  }

  useEffect(() => {
    handlePaymentItems(paymentItems)
    initOrderNumber()
  }, [paymentItems, paymentTotal, deliveryCharge])

  // Handle delivery checkbox change
  const handleDeliveryCheckboxChange = e => {
    const isChecked = e.target.checked
    setIsDeliveryChecked(isChecked) // Update the state
    if (isChecked) {
      handleDeliveryChargeChange(20) // Add delivery charge
    } else {
      handleDeliveryChargeChange(0) // Remove delivery charge
    }
  }

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

    return true
  }

  const lastAmountCheck = (paymentTotal, paymentMethod) => {
    const requiresOnlinePayment = onlinePaymentIsRequired(paymentTotal)

    if (requiresOnlinePayment) {
      switch (paymentMethod) {
        case 'self-collect':
        case 'cash':
          setPopupMessage(
            `${name}, your order total is R${paymentTotal}, exceeding cash limit. you can only pay cash for purchase under R200.00. Select Different Payment Method`
          )
          setShowPopup(true)

          return true
      }
    }

    return false
  }

  const delayedSubmit = () => {
    setLoading(true)

    setTimeout(() => {
      handleSubmitOrder()
      resetOrderState()
      const done = resetPaymentState()

      if (done) {
        setLoading(false)
        setShowPaymentForm(false)
      }
    }, 7000)
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      setLoading(false)
      return
    }

    // Set the order ID directly based on context value
    setOrderId(orderNumber)

    if (paymentMethod === 'online' || paymentMethod === 'online-delivery') {
      handlePaymentGateway()
    } else if (!lastAmountCheck(paymentTotal, paymentMethod)) {
      delayedSubmit() // Only call delayedSubmit if amount check passes
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }

  const handleCloseForm = () => {
    resetPaymentState()
    setShowPaymentForm(false)
  }

  const renderAddressInputs = () => {
    if (paymentMethod === 'self-collect') {
      return null
    }

    return (
      <div>
        <div className='form-group'>
          <label>
            <input
              type='text'
              value={streetAddress}
              onChange={handleStreetAddressChange}
              placeholder='Street Address'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            <input
              type='text'
              value={houseNumber}
              onChange={handleHouseNumbersChange}
              placeholder='House Number'
              required
            />
          </label>
        </div>
      </div>
    )
  }

  return (
    <div id='payment-form'>
      <div className='overlay show' onClick={handleCloseForm}></div>
      <div className='payment-details'>
        <form onSubmit={handleFormSubmit}>
          <div className='form-group'>
            <h3>Payment details</h3>
            <hr />
            <label>
              <input
                type='text'
                value={name}
                onChange={handleNameChange}
                placeholder='Name'
                required
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <input
                type='tel'
                value={phone}
                onChange={handlePhoneChange}
                pattern='[0-9]{10}'
                placeholder='Phone number'
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
                onChange={e => {
                  switch (e.target.value.trim()) {
                    case 'cash':
                      setPopupMessage(
                        '🚚 Delivery is currently limited to 📍 Boitekong Ext 2, 4, 5, 6 & 8'
                      )
                      setShowPopup(true)
                      break
                  }
                  handlePaymentChange(e)
                }}
              >
                <option value='online'>Pay Online</option>
                <option value='self-collect'>Pay on Collection</option>
                <option value='cash'>Cash on Delivery (+R20.00)</option>
              </select>
            </label>
          </div>

          {paymentMethod !== 'cash' && (
            <div className='checkbox-container'>
              <input
                type='checkbox'
                id='deliveryCheckbox'
                checked={isDeliveryChecked}
                onChange={handleDeliveryCheckboxChange}
              />
              <label htmlFor='deliveryCheckbox'>
                <strong>Add Delivery (+R20.00)</strong>
              </label>
            </div>
          )}

          <p>
            Total Delivery Charge: <strong>R{deliveryCharge}.00</strong>
          </p>
          <p>
            Required Payment Total:
            <strong> R{paymentTotal}</strong>
          </p>

          {renderAddressInputs()}
          <label htmlFor='termsCheckbox' id='terms'>
            <input type='checkbox' name='terms' id='termsCheckbox' required />I
            agree with the Terms and Conditions
            <button
              type='button'
              onClick={() => {
                setPopupMessage(termsAndConditions)
                setShowPopup(true)
              }}
            >
              See Terms and Conditions
            </button>
          </label>
          <button type='submit' className='basket-btn'>
            Place Order
          </button>

          <button type='button' className='cancel' onClick={handleCloseForm}>
            Cancel
          </button>
        </form>
      </div>
      {loading && (
        <div id='payment-overlay'>
          <Loading />
        </div>
      )}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  )
}

PaymentForm.propTypes = {
  setShowPaymentForm: PropTypes.func.isRequired,
  paymentItems: PropTypes.array.isRequired,
  resetOrderState: PropTypes.func.isRequired
}

export default PaymentForm
