import React, { useContext, useEffect, useState } from 'react'
import {
  FaUtensils,
  FaSearch,
  FaInfoCircle,
  FaPhone,
  FaDownload
} from 'react-icons/fa' // Import icons
import Footer from '../footer/Footer.jsx'
import PropTypes from 'prop-types'

import OrderContext from '../../context/order/context.jsx'
import { deferredPrompt } from '../../main.jsx' // Import the deferredPrompt

import './side_nav.css'

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const { setIsSearchOrderVisible } = useContext(OrderContext)
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

  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <ul className='sidebar-list'>
          <li
            onClick={() => handleClick('#menu')}
            className='sidebar-list-item'
          >
            <FaUtensils className='icon' />
            <span>Food</span>
          </li>
          <li onClick={handleSearchOrderClick} className='sidebar-list-item'>
            <FaSearch className='icon' />
            <span>Search Order</span>
          </li>
          <li
            onClick={() => handleClick('#about')}
            className='sidebar-list-item'
          >
            <FaInfoCircle className='icon' />
            <span>About Us</span>
          </li>
          <li
            onClick={() => handleClick('#contact')}
            className='sidebar-list-item'
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
      </nav>
    </>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
}

export default Sidebar
