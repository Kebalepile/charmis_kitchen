import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, PIZZA_MENU } from '../../../context/types'

export default function PizzaMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)

  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(PIZZA_MENU)
  }

  const imageUrl = './assets/images/pizza/4.jpg'

  return (
    <div
      className='menu-card'
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={handleClick}
    >
      <div className='overlay'></div> {/* Overlay for the blur effect */}
      <img src={imageUrl} alt='Pizza' className='menu-card-img' />
      <div className='caption'>Pizza</div>
    </div>
  )
}
