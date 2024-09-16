import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, DIKUKU_MENU } from '../../../context/types'

export default function DikukuMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(DIKUKU_MENU)
  }

  return (
    <div className='menu-card'>
      <img
        src='./assets/images/dikuku/3.jpg'
        alt='Dikuku'
        className='menu-card-img'
      />
      <button className='menu-btn' onClick={handleClick}>
        Dikuku
      </button>
    </div>
  )
}
