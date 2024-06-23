import React from 'react';


const Sidebar = () => {
  return (
    <nav className="sidebar-nav">
      <h2 className="sidebar-header">Menu</h2>
      <ul className="sidebar-list">
        <li className="sidebar-list-item"><a href="#food" className="sidebar-link">Food</a></li>
        <li className="sidebar-list-item"><a href="#about-us" className="sidebar-link">About Us</a></li>
        <li className="sidebar-list-item"><a href="#contact-us" className="sidebar-link">Contact Us</a></li>
        <li className="sidebar-list-item"><a href="#login" className="sidebar-link">Login</a></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
