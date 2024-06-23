import React, { useState } from 'react';
import { MdMenuBook } from 'react-icons/md';
import logo from '../assets/1.png';
import Sidebar from './Sidebar';

export default function Navbar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <nav className='navbar'>
        <MdMenuBook
          id='side-bar'
          title='checkout menu'
          onClick={toggleSidebar}
        />
        <img src={logo} alt='logo' id='logo' title="charmi's kitchen" />
      </nav>
      {isSidebarVisible && <Sidebar toggleSidebar={toggleSidebar} />}
    </>
  );
}
