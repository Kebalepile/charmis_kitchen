import React, { useEffect, useContext } from 'react'

import PaymentContext from '../../context/payment/context'

/**
 * @description The `YocoPayment` component handles the redirection to the Yoco payment gateway.
 * It utilizes the `RedirectToCheckout` method from the `PaymentContext` to initiate the payment process.
 * Upon receiving a successful response, it redirects the user to the checkout page using the provided URL.
 * If an error occurs during the payment process, it logs the error to the console.
 *
 * @returns {null} The component doesn't render any UI elements.
 */
const YocoPayment = () => {
  const { RedirectToCheckout } = useContext(PaymentContext)

  useEffect(() => {
    /**
     * @description Initiates the payment process by calling `RedirectToCheckout`.
     * It attempts to redirect the user to the external payment page if a valid redirect URL is returned.
     */
    const initiatePayment = async () => {
      try {
        const res = await RedirectToCheckout()
        console.log(res)

        // Check if res contains the expected 'redirectUrl'
        if (res && res.redirectUrl) {
          // Redirect to the external payment gateway URL
          window.location.assign(res.redirectUrl)
        } else {
          console.error('Redirect URL not found')
        }
      } catch (error) {
        console.error('Payment error:', error)
      }
    }

    initiatePayment()
  }, [RedirectToCheckout])

  return null // No UI rendering required
}

export default YocoPayment
