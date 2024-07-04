import React, { useContext } from 'react';
import MenuContext from '../../../context/menu/context';
import { MENU, MAGWINYA_MENU} from '../../../context/types';
import { GiDonut } from "react-icons/gi";

export default function MagwinyaMenu() {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext);
  const handleClick = () => {
    OpenMenu(MENU, true);
    ChooseMenu(MAGWINYA_MENU);
  };
  return (
    <button className='menu-btn' onClick={handleClick}>
      <GiDonut /> Magwinya
    </button>
  );
}
