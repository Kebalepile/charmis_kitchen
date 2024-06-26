import React, { useContext, useEffect } from 'react'
import MenuContext from '../context/menu/context'
import OrderContext from '../context/order/context'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import PizzaMenu from './food/pizza/PizzaMenu'
import ChickenMenu from './food/chicken/ChickenMenu'
import OrderBasket from './food/OrderBasket'
import ChipsMenu from './food/chips/ChipsMenu'
import ReadMenu from './ReadMenu'

export default function Menu () {
  const { MENU: _menu_ } = useContext(MenuContext)
  const { basket, basketItems } = useContext(OrderContext)

  useEffect(() => {}, [_menu_, basket, basketItems])

  return (
    <section id='menu'>
      <MdOutlineRestaurantMenu className='menu-icon' />
      <h1>Menu</h1>
      <hr className='sm-hr' />
      <br />
      <ChipsMenu />
      <PizzaMenu />
      <ChickenMenu />

      {basket && <OrderBasket basketItems={basketItems} />}
      {_menu_ && <ReadMenu />}
    </section>
  )
}
