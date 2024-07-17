import React, { useContext, useEffect } from 'react'
import MenuContext from '../context/menu/context'
import OrderContext from '../context/order/context'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import MagwinyaMenu from './food/magwinya/MagwinyaMenu'
import DikukuMenu from './food/dikuku/DikukuMenu'
import PizzaMenu from './food/pizza/PizzaMenu'
import ChickenMenu from './food/chicken/ChickenMenu'
import ChipsMenu from './food/chips/ChipsMenu'
import ReadMenu from './ReadMenu'
import OrderBasket from './food/OrderBasket'

export default function Menu () {
  const { MENU: _menu_ } = useContext(MenuContext)
  const {
    basket,
    basketItems,
    updateBasketItems,
    handleCloseBasket,
    resetOrderState
  } = useContext(OrderContext)

  useEffect(() => {
    if (basketItems.length <= 0 && basket) {
      handleCloseBasket()
    }
  }, [_menu_, basket, basketItems])

  return (
    <section id='menu'>
      {basket && (
        <OrderBasket
          basketItems={basketItems}
          updateBasketItems={updateBasketItems}
          resetOrderState={resetOrderState}
        />
      )}
      {_menu_ && <ReadMenu />}

      <MdOutlineRestaurantMenu className='menu-icon' />
      <h1>Menu</h1>
      <hr className='sm-hr' />
      <div className='menu-grid'>
        <div className='menu-item'>
          <PizzaMenu />
        </div>

        <div className='menu-item'>
          <MagwinyaMenu />
        </div>
        <div className='menu-item'>
          <ChickenMenu />
        </div>
        <div className='menu-item'>
          <ChipsMenu />
        </div>

        <div className='menu-item'>
          <DikukuMenu />
        </div>
      </div>
    </section>
  )
}
