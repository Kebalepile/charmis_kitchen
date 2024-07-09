import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PaymentContext from '../context/payment/context';
import Popup from './Popup';
import { ServerDomain } from '../context/types';

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
    resetPaymentState,
  } = useContext(PaymentContext);

  useEffect(() => {
    handlePaymentItems(paymentItems);
  }, [paymentItems]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [yocoSdkLoaded, setYocoSdkLoaded] = useState(false);

  useEffect(() => {
    // Load Yoco script
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    script.onload = () => setYocoSdkLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

    return true;
  };

  const handleYocoPayment = (additionalCharge = 0) => {
    if (yocoSdkLoaded) {
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_9d6360c3kw7G48w14574', // Replace with your actual public key
      });

      yoco.showPopup({
        amountInCents: (paymentTotal + deliveryCharge + additionalCharge) * 100, // Convert to cents
        currency: 'ZAR',
        name: 'B-town Bites',
        description: 'Order Payment',
        callback: async (result) => {
          if (result.error) {
            setPopupMessage('Error: ' + result.error.message);
            setShowPopup(true);
          } else {
            try {
              const developemtServer = 'http://localhost:5000'
              const response = await fetch(`${developemtServer}/process-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: result.id,
                  paymentTotal: paymentTotal + additionalCharge,
                  deliveryCharge,
                }),
              });
              const data = await response.json();
              console.log(data)
              if (data.success) {
                handleSubmitOrder();
                resetOrderState();
                resetPaymentState();
                setShowPaymentForm(false);
              } else {
                setPopupMessage('Payment failed.');
                setShowPopup(true);
              }
            } catch (error) {
              setPopupMessage('Payment failed.');
              setShowPopup(true);
            }
          }
        },
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (paymentMethod === 'online') {
        handleYocoPayment();
      } else if (paymentMethod === 'online-delivery') {
        handleYocoPayment(10); // Adding R10 for delivery
      } else {
        handleSubmitOrder();
        resetOrderState();
        resetPaymentState();
        setShowPaymentForm(false);
      }
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
      return null;
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
    );
  };

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
                onChange={(e) => {
                  switch (e.target.value.trim()) {
                    case 'online-delivery':
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
                <option value='online'>Pay Online</option>
                <option value='online-delivery'>Pay Online + Delivery (+R15.00)</option>
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
