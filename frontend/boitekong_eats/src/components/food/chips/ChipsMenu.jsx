import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, CHIPS_MENU } from '../../../context/types';

export default function ChipsMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(CHIPS_MENU);
  };
  return (
    <div className='menu-card'>
      <img
        src='./assets/images/chips/2.jpg'
        alt='Magwinya'
        className='menu-card-img'
      />
      <button className='menu-btn' onClick={handleClick}>
        Chips
      </button>
    </div>
  );
}
