import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, MAGWINYA_MENU } from '../../../context/types'

export default function MagwinyaMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(MAGWINYA_MENU)
  }

  return (
    <div className='menu-card'>
      <img
        src='./assets/images/magwinya/4.jpg'
        alt='Magwinya'
        className='menu-card-img'
      />
      <button className='menu-btn' onClick={handleClick}>
        Magwinya
      </button>
    </div>
  )
}
