import React, { useContext, useEffect, useState } from 'react'
import {
  FaUtensils,
  FaSearch,
  FaInfoCircle,
  FaPhone,
  FaDownload,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa'
import Footer from '../footer/Footer.jsx'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import PropTypes from 'prop-types'

import OrderContext from '../../context/order/context.jsx'
import CustomerContext from '../../context/customer/context.jsx'

import { deferredPrompt } from '../../main.jsx'

import './side_nav.css'

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const { setIsSearchOrderVisible } = useContext(OrderContext)
  const {
    ToggleLoginForm,
    showCustomerProfile,
    LoadEndUserProfile,
    CustomerLogout
  } = useContext(CustomerContext)

  const [loading, setLoading] = useState(false)
  const [showPopup, setshowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [prompt, setPrompt] = useState(null)

  const handleClickOutside = event => {
    if (
      isSidebarVisible &&
      !event.target.closest('.sidebar-nav ') &&
      !event.target.closest('#side-bar')
    ) {
      toggleSidebar()
    }
  }
  useEffect(() => {
    LoadEndUserProfile()
    if (sessionStorage.getItem('deferredPrompt')) {
      setPrompt(deferredPrompt)
    }
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isSidebarVisible])

  const handleClick = id => {
    toggleSidebar()
    const elem = document.body.querySelector(id)
    if (elem) elem.scrollIntoView({ behavior: 'auto', block: 'center' })
  }

  const handleSearchOrderClick = () => {
    setIsSearchOrderVisible()
    handleClick('#search-order')
  }

  const handleInstallClick = () => {
    if (prompt) {
      prompt.prompt()
      prompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        setPrompt(null)
        sessionStorage.removeItem('deferredPrompt')
      })
    }
  }

  const toggleLoginFormVisibility = () => {
    toggleSidebar()
    ToggleLoginForm()
  }
  const handleLogout = async () => {
    
    setLoading(true)

      let res = await CustomerLogout()
      
      if (res?.error) {
        setLoading(false)
        setPopupMessage(res?.error)
        setshowPopup(true)
      }
      if (res?.message) {
        setLoading(false)
        setPopupMessage(res.message)
        setshowPopup(true)
       
      }
  }
  const handleViewProfile = async () => {
    alert("view profile")
  }

  const closePopup = () => {
    setshowPopup(false)
    setPopupMessage('')
  }
  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <ul className='sidebar-list'>
          {!showCustomerProfile && (
            <li
              onClick={toggleLoginFormVisibility}
              className='sidebar-list-item shortcut'
            >
              <FaUser className='icon' />
              <span>Login</span>
            </li>
          )}

          {showCustomerProfile && (
            <li onClick={handleLogout} className='sidebar-list-item shortcut'>
              <FaSignOutAlt className='icon' />
              <span>Logout</span>
            </li>
          )}

          {showCustomerProfile && (
            <li
              onClick={handleViewProfile}
              className='sidebar-list-item shortcut'
            >
              <FaUser className='icon' />
              <span>Profile</span>
            </li>
          )}

          <li
            onClick={() => handleClick('#menu')}
            className='sidebar-list-item shortcut'
          >
            <FaUtensils className='icon' />
            <span>Food Menu</span>
          </li>
          <li
            onClick={handleSearchOrderClick}
            className='sidebar-list-item shortcut'
          >
            <FaSearch className='icon' />
            <span>Search Order</span>
          </li>
          <li
            onClick={() => handleClick('#about')}
            className='sidebar-list-item shortcut'
          >
            <FaInfoCircle className='icon' />
            <span>About Us</span>
          </li>
          <li
            onClick={() => handleClick('#contact')}
            className='sidebar-list-item shortcut'
          >
            <FaPhone className='icon icon-inverted' />
            <span>Contact Us</span>
          </li>
          {prompt && (
            <li
              onClick={handleInstallClick}
              className='sidebar-list-item install-button'
            >
              <FaDownload className='icon' />
              <span>Install</span>
            </li>
          )}
        </ul>
        <hr className='bg-hr' />
        <Footer />
        {loading && (
        <div id='payment-overlay'>
          <Loading />
        </div>
      )}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    
      </nav>
    </>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
}

export default Sidebar
