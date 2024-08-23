import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, CHIPS_MENU } from '../../../context/types'

export default function ChipsMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(CHIPS_MENU)
  }

  const imageUrl = './assets/images/chips/4.jfif'
  return (
    <div
      className='menu-card'
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={handleClick}
    >
      <div className='overlay'></div> {/* Overlay for the blur effect */}
      <img src={imageUrl} alt='Chicken Wings' className='menu-card-img' />
      <div className='caption'>Chips</div>
    </div>
  )
}
