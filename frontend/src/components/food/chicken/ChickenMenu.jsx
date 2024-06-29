import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, CHICKEN_MENU } from '../../../context/types';
import { GiRoastChicken } from "react-icons/gi";

export default function ChickenMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(CHICKEN_MENU);
  };
  return (
    <button className='menu-btn' onClick={handleClick}>
     <GiRoastChicken /> Chicken
    </button>
  );
}
