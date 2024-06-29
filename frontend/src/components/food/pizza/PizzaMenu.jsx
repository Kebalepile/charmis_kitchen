import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, PIZZA_MENU } from '../../../context/types';
import { GiFullPizza } from 'react-icons/gi';

export default function PizzaMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(PIZZA_MENU);
  };
  return (
    <button className='menu-btn' onClick={handleClick}>
      <GiFullPizza /> Pizza
    </button>
  );
}
