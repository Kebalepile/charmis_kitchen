import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PaymentContext from '../../context/payment/context'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import termsAndConditions from '../../assets/policies/termsAndConditions'
import YocoPayment from './YocoPayment'

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
    initOrderNumber
  } = useContext(PaymentContext)

  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showYocoPaymentGateWay, setShowYocoPaymentGateWay] = useState(false)
  const [orderId, setOrderId] = useState('')

  const onlinePaymentIsRequired = paymentTotal => {
    if (paymentTotal > 200) {
      setPopupMessage(
        'Order total exceeds R200. You have to pay via online payment or cash transfer after clicking "Place Order".'
      )
      setShowPopup(true)
      return true
    }
    return false
  }

  const PaymentGateWay = () => {
    setShowYocoPaymentGateWay(true)
  }

  useEffect(() => {
    handlePaymentItems(paymentItems)
    initOrderNumber()
  }, [paymentItems, paymentTotal, deliveryCharge])

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
    const yes = onlinePaymentIsRequired(paymentTotal)
    if (yes) {
      switch (paymentMethod) {
        case 'self-collect':
        case 'cash':
          setPopupMessage(
            `Order total is R${paymentTotal} which exceeds eligible cash payment amount (R200).
           For this order to be successful you need to pay via online or bank transfer.`
          )
          setShowPopup(true)
          PaymentGateWay()
          return true
      }
    }

    return false
  }
  /**
   * @description Wrapper Method to handle the delayed submission of data to the backend and state reset
   */
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

  const TogglePaymentGateWay = () => {
    setTimeout(() => {
      setShowYocoPaymentGateWay(!showYocoPaymentGateWay)
    }, 9000)
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      setLoading(false)
      return
    }

    setOrderId(orderNumber)

    switch (paymentMethod) {
      case 'online':
      case 'online-delivery':
        PaymentGateWay()
        break

      default:
        !lastAmountCheck(paymentTotal, paymentMethod) &&
        !showPopup &&
        !showYocoPaymentGateWay
          ? delayedSubmit()
          : null
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
                        '🚚 Delivery is currently limited to 📍 Boitekong Ext 2, 4, 5, 6 & 8'
                      )
                      setShowPopup(true)
                      break
                  }
                  handlePaymentChange(e)
                }}
              >
                <option value='self-collect'>Pay on Collection</option>
                <option value='online'>Pay Online</option>
                <option value='cash'>Cash on Delivery (+R20.00)</option>

                <option value='online-delivery'>
                  Pay Online + Delivery (+R20.00)
                </option>
              </select>
            </label>
          </div>
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

      {showYocoPaymentGateWay && (
        <YocoPayment
          paymentTotal={paymentTotal}
          toggleComponent={TogglePaymentGateWay}
         
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
