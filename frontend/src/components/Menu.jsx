import React, { useContext, useEffect } from 'react'
import MenuContext from '../context/menu/context'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import PizzaMenu from './food/pizza/PizzaMenu'
import ChickenMenu from './food/chicken/ChickenMenu'
import CompleteMenu from './food/CompleteMenu'
import ChipsMenu from './food/chips/ChipsMenu'
import ReadMenu from './ReadMenu'

export default function Menu () {
  const { MENU: _menu_ } = useContext(MenuContext)

  useEffect(() => {}, [_menu_])

  return (
    <section id='menu'>
      <MdOutlineRestaurantMenu className='menu-icon' />
      <h1>Menu</h1>
      <hr className='sm-hr' />
      <br />
      <ChipsMenu />
      <PizzaMenu />
      <ChickenMenu />

      <CompleteMenu />
      {_menu_ && <ReadMenu />}
    </section>
  )
}
