import React, { useContext, useEffect, useState } from 'react';
import Footer from './Footer';
import PropTypes from 'prop-types';
import { GiSlicedBread } from 'react-icons/gi';
import OrderContext from '../context/order/context';

const Sidebar = ({ toggleSidebar, isSidebarVisible }) => {
  const { setIsSearchOrderVisible } = useContext(OrderContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = (id) => {
    toggleSidebar();
    const elem = document.body.querySelector(id);
    if (elem) elem.scrollIntoView({ behavior: 'auto', block: 'center' });
  };

  const handleSearchOrderClick = () => {
    setIsSearchOrderVisible();
    handleClick('#search-order');
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // console.log('User accepted the A2HS prompt');
        } else {
          // console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <nav className={`sidebar-nav ${isSidebarVisible ? 'show' : 'hide'}`}>
        <h4 className='sidebar-header'>
          <GiSlicedBread /> Menu
        </h4>
        <hr className='bg-hr' />
        <ul className='sidebar-list'>
          <li onClick={() => handleClick('#menu')} className='sidebar-list-item'>
            Food
          </li>
          <li onClick={handleSearchOrderClick} className='sidebar-list-item'>
            Search Order
          </li>
          <li onClick={() => handleClick('#about')} className='sidebar-list-item'>
            About Us
          </li>
          <li onClick={() => handleClick('#contact')} className='sidebar-list-item'>
            Contact Us
          </li>
          {deferredPrompt && (
            <li onClick={handleInstallClick} className='sidebar-list-item install-button'>
              Install app
            </li>
          )}
        </ul>
        <hr className='bg-hr' />
        <Footer />
      </nav>
    </>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
};

export default Sidebar;
