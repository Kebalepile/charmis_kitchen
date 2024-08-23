import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, CHICKEN_MENU } from '../../../context/types'

import '../foodMenu.css'

export default function ChickenMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(CHICKEN_MENU)
  }
  const imageUrl = './assets/images/chicken/8.jpg'
  return (
    <div
      className='menu-card'
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={handleClick}
    >
      <div className='overlay'></div> {/* Overlay for the blur effect */}
      <img src={imageUrl} alt='Chicken Wings' className='menu-card-img' />
      <div className='caption'>Wings</div>
    </div>
  )
}
