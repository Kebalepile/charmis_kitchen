import React, { useState, useEffect, useContext } from 'react'
import Menu from '../menu/Menu'
import Slideshow from '../slideShow/Slideshow'
import SearchOrder from '../search/SearchOrder'
import PaymentContext from '../../context/payment/context'
import Popup from '../popup/Popup'
import useYocoPayment from '../../hooks/useYocoPayment'
import {
  getStoredOrderData,
  clearStoredOrderData
} from '../../utils/localStorageUtils'

import './home.css'

export default function Home () {
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const { restPunchedOrder, orderSubmitted, paymetGatewayClosed, onlinePay } =
    useContext(PaymentContext)
  const { initiatePayment } = useYocoPayment()
  useEffect(() => {
    if (onlinePay) {
      initiatePayment()
      paymetGatewayClosed()
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
        <Slideshow />

        {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      </section>
      <SearchOrder />
      <Menu />
    </>
  )
}
