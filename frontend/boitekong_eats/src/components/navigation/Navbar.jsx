import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Updated icon
import logo from '../../assets/1.png';
import Sidebar from './Sidebar';

import './nav.css';

export default function Navbar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <nav className="navbar">
        <FaBars
          id="side-bar"
          title="Toggle menu"
          onClick={toggleSidebar}
        />
        <img src={logo} alt="logo" id="logo" title="boitekong eats" />
      </nav>
      {isSidebarVisible && (
        <Sidebar
          toggleSidebar={toggleSidebar}
          isSidebarVisible={isSidebarVisible}
        />
      )}
    </>
  );
}
