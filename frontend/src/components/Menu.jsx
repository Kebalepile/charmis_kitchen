import React, { useContext, useEffect } from 'react'
import MenuContext from '../context/menu/context'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import PizzaMenu from './food/pizza/PizzaMenu'
import ChickenMenu from './food/chicken/ChickenMenu'
import CompleteMenu from './food/CompleteMenu'
import ReadMenu from './ReadMenu'

export default function Menu () {
  const { MENU } = useContext(MenuContext)
  useEffect(() => {
    console.log(MENU)
  }, [MENU])
  return (
    <section id='menu'>
      <MdOutlineRestaurantMenu className='menu-icon' />
      <h1>Menu</h1>
      <hr className='sm-hr' />
      <br />
      <PizzaMenu />
      <ChickenMenu />
      <CompleteMenu />
      {MENU && <ReadMenu />}
    </section>
  )
}
