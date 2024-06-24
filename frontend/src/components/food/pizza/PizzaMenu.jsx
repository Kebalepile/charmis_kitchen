import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, PIZZA_MENU } from '../../../context/types';
import { FaBookOpen } from 'react-icons/fa';

export default function PizzaMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU,true);
    ChooseMenu(PIZZA_MENU);
  };
  return (
    <section id='pizza-menu'>
      <button className='menu-btn' onClick={handleClick}>
        Pizza <FaBookOpen />
      </button>
    </section>
  );
}
