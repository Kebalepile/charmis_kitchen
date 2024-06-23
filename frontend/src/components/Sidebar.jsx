import React from 'react'
import Footer from './Footer'
import PropTypes from 'prop-types'

const Sidebar = ({ toggleSidebar , isSidebarVisible }) => {
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
    <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
      <h2 className='sidebar-header'>Menu</h2>
      <hr className="bg-hr"/>
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
      <hr className="bg-hr"/>
      <Footer/>
    </nav>
  )
}

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
};

export default Sidebar
