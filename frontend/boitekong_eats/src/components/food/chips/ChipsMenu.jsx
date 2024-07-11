import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, CHIPS_MENU } from '../../../context/types';
import { GiFrenchFries } from 'react-icons/gi';

export default function ChipsMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(CHIPS_MENU);
  };
  return (
    <button className='menu-btn' onClick={handleClick}>
      <GiFrenchFries /> Chips
    </button>
  );
}
