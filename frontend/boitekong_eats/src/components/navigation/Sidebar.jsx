import React, { useContext, useEffect, useState } from 'react'
import {
  FaUtensils,
  FaSearch,
  FaInfoCircle,
  FaPhone,
  FaDownload,
  FaUser // Import user icon
} from 'react-icons/fa'
import Footer from '../footer/Footer.jsx'
import PropTypes from 'prop-types'
import OrderContext from '../../context/order/context.jsx'
import { deferredPrompt } from '../../main.jsx'
import Authentication from "../authenticate/Authentication.jsx"
import './side_nav.css'

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const { setIsSearchOrderVisible } = useContext(OrderContext)
  const [prompt, setPrompt] = useState(null)
  const [isAuthVisible, setIsAuthVisible] = useState(false)

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

  const toggleAuthVisibility = () => {
    setIsAuthVisible(prev => !prev)
  }

  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <ul className='sidebar-list'>
          <li
            onClick={() => handleClick('#menu')}
            className='sidebar-list-item shortcut'
          >
            <FaUtensils className='icon' />
            <span>Food Menu</span>
          </li>
          <li onClick={handleSearchOrderClick} className='sidebar-list-item shortcut'>
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
          {/* Add Login/Register button with icon */}
          <li onClick={toggleAuthVisibility} className='sidebar-list-item shortcut'>
            <FaUser className='icon' />
            <span>{isAuthVisible ? 'Close' : 'Login/Register'}</span>
          </li>
        </ul>
        <hr className='bg-hr' />
        <Footer />
      </nav>

      {/* Render Authentication component based on isAuthVisible */}
      {isAuthVisible && <Authentication />}
    </>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
}

export default Sidebar
