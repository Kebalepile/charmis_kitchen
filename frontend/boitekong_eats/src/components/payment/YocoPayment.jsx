import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import PaymentContext from '../../context/payment/context';

/**
 * @description The `YocoPayment` component handles the redirection to the Yoco payment gateway.
 * It utilizes the `RedirectToCheckout` method from the `PaymentContext` to initiate the payment process.
 * Upon receiving a successful response, it redirects the user to the checkout page using the provided URL.
 * If an error occurs during the payment process, it logs the error to the console.
 *
 * @param {number} paymentTotal - The total payment amount to be processed through Yoco.
 * @param {function} toggleComponent - Function to toggle the visibility of the payment component.
 * 
 *
 * @returns {null} The component doesn't render any UI elements.
 */
const YocoPayment = ({ paymentTotal, toggleComponent }) => {
  const { RedirectToCheckout } = useContext(PaymentContext);

  useEffect(() => {
    /**
     * @description Initiates the payment process by calling `RedirectToCheckout`.
     * It attempts to redirect the user to the external payment page if a valid redirect URL is returned.
     */
    const initiatePayment = async () => {
      try {
        const res = await RedirectToCheckout({ paymentTotal });
        console.log(res);

        // Check if res contains the expected 'redirectUrl'
        if (res && res.redirectUrl) {
          // Redirect to the external payment gateway URL
          window.location.assign(res.redirectUrl);
        } else {
          console.error('Redirect URL not found');
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    };

    initiatePayment();
  }, [paymentTotal, RedirectToCheckout]);

  return null; // No UI rendering required
};

YocoPayment.propTypes = {
  /**
   * @description The total amount to be paid, which will be passed to Yoco for processing.
   */
  paymentTotal: PropTypes.number.isRequired,

  /**
   * @description Function to toggle the payment component's visibility.
   */
  toggleComponent: PropTypes.func.isRequired
};

export default YocoPayment;
