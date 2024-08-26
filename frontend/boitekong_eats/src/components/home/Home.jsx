import React, { useState, useEffect, useContext } from 'react'
import Menu from '../menu/Menu'
import Slideshow from '../slideShow/Slideshow'
import SearchOrder from '../search/SearchOrder'
import PaymentContext from '../../context/payment/context'
import Popup from '../popup/Popup'
import BankDetails from '../banking/BankingDetails'
import "./home.css"

export default function Home () {
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const { restPunchedOrder, orderSubmitted } = useContext(PaymentContext)

  useEffect(() => {
    if (orderSubmitted) {
      setPopupMessage(
        '📋👤Your order has been placed. Please wait a few minutes for an SMS notification 📲'
      )

      setShowPopup(true)
      restPunchedOrder()
    }
  }, [orderSubmitted])

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }
  return (
    <>
      <section id='home'>
        <Slideshow />
        <BankDetails orderId="keba"/>
        {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      </section>
      <SearchOrder />
      <Menu />
    </>
  )
}
