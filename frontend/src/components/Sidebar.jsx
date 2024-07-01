import React, { useState } from 'react';
import Footer from './Footer';
import PropTypes from 'prop-types';
import { GiSlicedBread } from 'react-icons/gi';
import SearchOrder from './SearchOrder'; // Import the SearchOrder component

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const [isSearchOrderVisible, setIsSearchOrderVisible] = useState(false);

  const handleClick = id => {
    toggleSidebar();
    const elem = document.body.querySelector(id);
    elem.scrollIntoView({ behavior: 'auto', block: 'center' });
  };

  const handleSearchOrderClick = () => {
    setIsSearchOrderVisible(!isSearchOrderVisible);
  };

  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <h4 className='sidebar-header'>
          <GiSlicedBread /> Menu
        </h4>
        <hr className='bg-hr' />
        <ul className='sidebar-list'>
          <li onClick={() => handleClick('#about')} className='sidebar-list-item'>
            About Us
          </li>
          <li onClick={() => handleClick('#contact')} className='sidebar-list-item'>
            Contact Us
          </li>
          <li onClick={() => handleClick('#menu')} className='sidebar-list-item'>
            Food
          </li>
          <li onClick={handleSearchOrderClick} className='sidebar-list-item'>
            Search Order
          </li>
          {/* <li onClick={handleLogin} className='sidebar-list-item'>
            Login
          </li> */}
        </ul>
        <hr className='bg-hr' />
        <Footer />
      </nav>
      {isSearchOrderVisible && <SearchOrder />} {/* Conditionally render SearchOrder */}
    </>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
};

export default Sidebar;
