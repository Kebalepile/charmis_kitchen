import React, { useState, useEffect, useContext } from 'react'
import Menu from '../menu/Menu'
import Slideshow from '../slideShow/Slideshow'
import SearchOrder from '../search/SearchOrder'
import LoginForm from '../authenticate/Authentication'
import PaymentContext from '../../context/payment/context'
import Popup from '../popup/Popup'
import useYocoPayment from '../../hooks/useYocoPayment'

import CustomerContext from '../../context/customer/context.jsx'

import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'

import './home.css'

export default function Home () {
  const { showLoginForm } = useContext(CustomerContext)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const { restPunchedOrder, orderSubmitted, paymetGatewayClosed, onlinePay } =
    useContext(PaymentContext)

  const { initiatePayment } = useYocoPayment()

  useEffect(() => {
    if (onlinePay) {
      initiatePayment()
      paymetGatewayClosed()
      let message = getStoredOrderData('loadingCheckout')
      setPopupMessage(message)
      setShowPopup(true)
      clearStoredOrderData('loadingCheckout')
    }

    const notifiedViaSms = getStoredOrderData('submitted')
    if (notifiedViaSms) {
      setPopupMessage(
        '📋👤Your order has been placed. Please wait a few minutes for an SMS notification 📲'
      )
      setShowPopup(true)
      clearStoredOrderData('submitted')
    }

    if (orderSubmitted) {
      setPopupMessage(
        '📋👤Your order has been placed. Please wait a few minutes for an SMS notification 📲'
      )
      setShowPopup(true)
      restPunchedOrder()
    }
  }, [orderSubmitted, onlinePay])

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }
  return (
    <>
      <section id='home'>
        {showLoginForm && <LoginForm />}
        {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
        <Slideshow />
      </section>
      <SearchOrder />
      <Menu />
    </>
  )
}
