import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, PIZZA_MENU } from '../../../context/types';

export default function PizzaMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(PIZZA_MENU);
  };
  return (
    <div className='menu-card'>
      <img
        src='./assets/images/pizza/4.jpg'
        alt='Magwinya'
        className='menu-card-img'
      />
      <button className='menu-btn' onClick={handleClick}>
        Pizza
      </button>
    </div>
  );
}
