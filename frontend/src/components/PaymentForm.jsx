import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PaymentContext from '../context/payment/context';
import Popup from './Popup';

const PaymentForm = ({ setShowPaymentForm, paymentItems, resetOrderState }) => {
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
    handleStreetAddressChange,
    handleSubmitOrder,
    resetPaymentState,
  } = useContext(PaymentContext);

  useEffect(() => {
    handlePaymentItems(paymentItems);
  }, [paymentItems]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const validateForm = () => {
    const phoneRegex = /^0[0-9]{9}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!phone.match(phoneRegex)) {
      setPopupMessage('📞 Phone number must be 10 digits and start with 0.');
      setShowPopup(true);
      return false;
    }

    if (!name.trim() || !name.match(nameRegex)) {
      setPopupMessage(
        '👤 Name must not be empty, contain only spaces, and should only include word characters.'
      );
      setShowPopup(true);
      return false;
    }

    // Additional validation logic as needed

    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmitOrder();
      resetOrderState();
      resetPaymentState();
      setShowPaymentForm(false);
      // Reset form if needed
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const handleCloseForm = () => {
    resetPaymentState();
    setShowPaymentForm(false);
  };

  const renderAddressInputs = () => {
    if (paymentMethod === 'self-collect') {
      return null; // Render nothing if self-collect
    }

    return (
      <div>
        <div className='form-group'>
          <label>
            {/* Street Address: */}
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
            {/* House Number: */}
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
    );
  };

  return (
    <div id='payment-form'>
      <div className='overlay show' onClick={handleCloseForm}></div>
      <div className='payment-details'>
        <form onSubmit={handleFormSubmit}>
          <div className='form-group'>
            <h3>Payment details</h3>
            <hr  />
            <label>
              {/* Name: */}
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
              {/* Phone (RSA only): */}
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
                onChange={(e) => {
                  switch (e.target.value.trim()) {
                    case 'online':
                    case 'cash':
                      setPopupMessage(
                        '🚚 Delivery is currently limited to 📍 Boitekong Ext 2, 4, 5, 6, and 8'
                      );
                      setShowPopup(true);
                      break;
                  }
                  handlePaymentChange(e);
                }}
              >
                <option value='self-collect'>Self Collect (Free)</option>
                <option value='cash'>Cash on Delivery (+R10.00)</option>
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

          <button type='button' className='cancel' onClick={handleCloseForm}>
            Cancel
          </button>
        </form>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

PaymentForm.propTypes = {
  setShowPaymentForm: PropTypes.func.isRequired,
  paymentItems: PropTypes.array.isRequired,
  resetOrderState: PropTypes.func.isRequired,
};

export default PaymentForm;
