import React from 'react'
import Footer from './Footer'
import PropTypes from 'prop-types'
import { GiSlicedBread } from 'react-icons/gi'

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const handleClick = id => {
    toggleSidebar()
    const elem = document.body.querySelector(id)
    elem.scrollIntoView({ behavior: 'auto', block: 'center' })
  }

  return (
    <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
      <h4 className='sidebar-header'>
        <GiSlicedBread /> Menu
      </h4>
      <hr className='bg-hr' />
      <ul className='sidebar-list'>
        <li onClick={() => handleClick('#about')} className='sidebar-list-item'>
          About Us
        </li>
        <li
          onClick={() => handleClick('#contact')}
          className='sidebar-list-item'
        >
          Contact Us
        </li>
        <li onClick={() => handleClick('#menu')} className='sidebar-list-item'>
          Food
        </li>
        {/* <li onClick={handleLogin} className='sidebar-list-item'>
          Login
        </li> */}
      </ul>
      <hr className='bg-hr' />
      <Footer />
    </nav>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
}

export default Sidebar
