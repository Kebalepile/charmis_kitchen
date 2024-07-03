import React, { useContext } from 'react'
import Footer from './Footer'
import PropTypes from 'prop-types'
import { GiSlicedBread } from 'react-icons/gi'

import OrderContext from '../context/order/context'
const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const { setIsSearchOrderVisible } = useContext(OrderContext)

  const handleClick = id => {
    toggleSidebar()
    const elem = document.body.querySelector(id)
    if (elem) elem.scrollIntoView({ behavior: 'auto', block: 'center' })
  }

  const handleSearchOrderClick = () => {
    setIsSearchOrderVisible()
    handleClick('#search-order')
  }

  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <h4 className='sidebar-header'>
          <GiSlicedBread /> Menu
        </h4>
        <hr className='bg-hr' />
        <ul className='sidebar-list'>
          <li
            onClick={() => handleClick('#menu')}
            className='sidebar-list-item'
          >
            Food
          </li>
          <li onClick={handleSearchOrderClick} className='sidebar-list-item'>
            Search Order
          </li>
          <li
            onClick={() => handleClick('#about')}
            className='sidebar-list-item'
          >
            About Us
          </li>
          <li
            onClick={() => handleClick('#contact')}
            className='sidebar-list-item'
          >
            Contact Us
          </li>
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
