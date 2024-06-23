import React from 'react'
import PropTypes from 'prop-types'

const Sidebar = ({ toggleSidebar }) => {
  const handleFood = () => {
    toggleSidebar()
  }
  const handleAboutUs = () => {
    toggleSidebar()
  }
  const handleContactUs = () => {
    toggleSidebar()
  }
  const handleLogin = () => {
    toggleSidebar()
  }

  return (
    <nav className='sidebar-nav'>
      <h2 className='sidebar-header'>Menu</h2>
      <ul className='sidebar-list'>
        <li onClick={handleFood} className='sidebar-list-item'>
          Food
        </li>
        <li onClick={handleAboutUs} className='sidebar-list-item'>
          About Us
        </li>
        <li onClick={handleContactUs} className='sidebar-list-item'>
          Contact Us
        </li>
        <li onClick={handleLogin} className='sidebar-list-item'>
          Login
        </li>
      </ul>
    </nav>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
}

export default Sidebar
