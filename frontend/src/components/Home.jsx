import React, { useState, useEffect, useContext } from 'react'
import Menu from './Menu'
import Slideshow from './Slideshow'
import SearchOrder from "./SearchOrder"
import PaymentContext from '../context/payment/context'
import Popup from './Popup'

export default function Home () {
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const { restPunchedOrder, orderSubmitted } = useContext(PaymentContext)

  useEffect(() => {
    if(orderSubmitted){
      setPopupMessage(
        '📋👤 Your order has been lodged. Please wait for a notification SMS. 📲'
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
        {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      </section>
      <SearchOrder/>
      <Menu />
    </>
  )
}
