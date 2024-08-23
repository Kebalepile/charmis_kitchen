import React, { useContext, useState } from 'react'
import OrderContext from '../../context/order/context'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import OrderDisplay from '../order/OrderDisplay'; 

import "./search.css"

export default function SearchOrder () {
  const { getOrder, orders, searchOrderFormVisible, setIsSearchOrderVisible } =
    useContext(OrderContext)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }

  const handleSearch = async e => {
    e.preventDefault()
    

    try {
      const isNum = Number(orderNumber)

      if (isNum) {
        setLoading(true)
        const [ok, message] = await getOrder(orderNumber)
        
        if (ok) {
          setLoading(false)
         
        } else {
          setLoading(false)
          setPopupMessage(message)
          setShowPopup(true)
        }
      } else {
        setPopupMessage('order number incorrect')
        setShowPopup(true)
      }
      setOrderNumber('')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const closeSearchForm = () => {
    setOrderNumber('')
    setIsSearchOrderVisible()
    setLoading(false)
  }

  return (
    <>
      {searchOrderFormVisible && (
        <div id='search-order' className='search-order-container'>
        
          <div className='overlay show' onClick={closeSearchForm}></div>

          <form onSubmit={handleSearch}>
            <input
              type='text'
              placeholder='Enter Order Number'
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className='search-order-input'
              required
            />
            <button type='submit' className='search-order-button'>
              Search
            </button>
            {loading && <Loading />}
            {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
          </form>
          {orders.length && <OrderDisplay />}
        </div>
      )}
    </>
  )
}
