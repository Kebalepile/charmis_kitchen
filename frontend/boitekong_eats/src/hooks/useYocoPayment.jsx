import { useState } from 'react'


import { ServerDomain } from '../context/types'
import { getStoredOrderData } from '../utils/localStorageUtils'
import { checkTime } from '../utils/Utils'

/***
 * @description determine if boitekong eats is open or closed
 * @return {boolean}
 */
const operatingHours = () => {
  const { startTime, endTime, currentTime } = checkTime()
  const notWorkingHours = currentTime < startTime || currentTime > endTime
  return notWorkingHours
}

const useYocoPayment = () => {
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  /**
   * @function RedirectToCheckout
   * @description Initiates a payment process using the Yoco Payment Gateway. It checks the operating hours,
   *              stores the new order details, support phone numbers, and cook phone numbers in a single object
   *              in local storage to ensure persistence across tabs/windows, and then makes a payment request to the server.
   * @returns {Promise<Object>} Returns the result of the payment request from the server.
   */
  const RedirectToCheckout = async () => {
    try {
      // Check if it's outside of operating hours
      const notWorkingHours = operatingHours()

      // if (notWorkingHours) {
      //   alert('⚠️ Operating hours between 09:00 am to 20:00 pm. 🌞')
      //   return
      // }

      const orderData = getStoredOrderData()

      // Get current base URL
      const baseUrl = window.location.origin

      // Create paths for success and cancel
      const successUrl = `${baseUrl}/order-success`
      const cancelUrl = `${baseUrl}/cancel-order`
      const failureUrl = `${baseUrl}/failed-checkout`

      // Send the new order to the server for processing payment
      const response = await fetch(`${ServerDomain}/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newOrder: orderData.newOrder,
          paths: {
            successUrl,
            cancelUrl,
            failureUrl
          }
        })
      })

      const result = await response.json()

      return result // Return the server response (e.g., payment link or confirmation)
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }
  const initiatePayment = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('opening yoco payment gateway')
      const res = await RedirectToCheckout()
  
      // Redirect to the external payment gateway URL
      if (res && res.redirectUrl) {
        window.location.href = res.redirectUrl 
      } else {
        console.error('No redirect URL found in the response')
        setError('Payment gateway URL not found')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('An error occurred during the payment process')
    } finally {
      setLoading(false)
    }
  }
  

  return {
    initiatePayment,
    loading,
    error
  }
}

export default useYocoPayment
