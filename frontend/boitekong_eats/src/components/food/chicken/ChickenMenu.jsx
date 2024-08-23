import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, CHICKEN_MENU } from '../../../context/types';

export default function ChickenMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(CHICKEN_MENU);
  };
  return (
    <div className='menu-card'>
    <img
      src='./assets/images/chicken/3.jpg'
      alt='Magwinya'
      className='menu-card-img'
    />
    <button className='menu-btn' onClick={handleClick}>
      Wings
    </button>
  </div>
  );
}
