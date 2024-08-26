import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PaymentContext from '../../context/payment/context'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import termsAndConditions from '../../assets/policies/termsAndConditions'
import BankingDetails from '../banking/BankingDetails'

import './payment.css'

const PaymentForm = ({ setShowPaymentForm, paymentItems, resetOrderState }) => {
  const {
    name = '', // Ensure name is defined
    phone = '', // Ensure phone is defined
    paymentMethod,
    deliveryCharge,
    paymentTotal,
    streetAddress = '', // Ensure streetAddress is defined
    houseNumber = '', // Ensure houseNumber is defined
    handleNameChange,
    handlePhoneChange,
    handlePaymentChange,
    handlePaymentItems,
    handleHouseNumbersChange,
    handleStreetAddressChange,
    handleSubmitOrder,
    resetPaymentState
  } = useContext(PaymentContext)

  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showBankingDetails, setShowBankingDetails] = useState(false) // To toggle BankingDetails component
  const [orderId, setOrderId] = useState('') // To store the orderId

  useEffect(() => {
    console.log(paymentTotal)
    if (paymentTotal > 50) {
      setPopupMessage(
        'Order total exceeds R50. You have to pay via online payment or cash transfer after clicking "Place Order".'
      )
      setShowPopup(true)
    }
    handlePaymentItems(paymentItems)
  }, [paymentItems, paymentTotal]) // Added paymentTotal to the dependency array

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

  const handleFormSubmit = e => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return // Stop execution if the form is not valid
    }

    // Generate orderId
    const generatedOrderId = `${name}_${phone}`
    setOrderId(generatedOrderId)

    switch (paymentMethod) {
      case 'online':
      case 'online-delivery':
        setShowBankingDetails(true)
        // handleYocoPayment()
        break
      default:
        setShowBankingDetails(true)
        // setTimeout(() => {
        //   handleSubmitOrder()
        //   resetOrderState()
        //   resetPaymentState()
        //   setLoading(false)
        //   setShowPaymentForm(false)
        // }, 7000)
        break
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
                    case 'online-delivery':
                    case 'cash':
                      setPopupMessage(
                        '🚚 Delivery is currently limited to 📍 Boitekong Ext 2, 4, 5, 6, and 8'
                      )
                      setShowPopup(true)
                      break
                  }
                  handlePaymentChange(e)
                }}
              >
                <option value='self-collect'>Self Collect (Free)</option>
                <option value='online'>Pay Online</option>
                <option value='cash'>Cash on Delivery (+R10.00)</option>

                <option value='online-delivery'>
                  Pay Online + Delivery (+R10.00)
                </option>
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
          <label htmlFor='termsCheckbox' id='terms'>
            <input type='checkbox' name='terms' id='termsCheckbox' required />I
            agree with the Terms and Conditions
            <button
              type='button'
              onClick={() => {
                // pass the Terms and Conditions to the popup component
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
      {showBankingDetails && (
        <BankingDetails
          phone={phone}
          orderId={orderId}
          paymentTotal={paymentTotal}
        />
      )}
    </div>
  )
}

PaymentForm.propTypes = {
  setShowPaymentForm: PropTypes.func.isRequired,
  paymentItems: PropTypes.array.isRequired,
  resetOrderState: PropTypes.func.isRequired
}

export default PaymentForm
