import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import MenuContext from '../../context/menu/context'
import { MENU, COMPLETE_MENU } from '../../context/types'
import { GiBookmarklet } from 'react-icons/gi'

export default function OrderBasket ({ basketItems }) {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(COMPLETE_MENU)
  }
  return (
    <section id='entire-menu' className="order-basket">
      <button className='menu-btn' onClick={handleClick}>
        Order Basket <GiBookmarklet />
        <h3>Pending orders</h3>
        {basketItems.map((order, index) => {
          return (
            <article key={index} className='order-item'>
              <p> order number: {order.orderNumber}</p>
              <p> meal: {order.itemName}</p>
              <p> number of meal ordered: {order.quantity}</p>
              {order.selectedSize.length && (
                <p> meal size: {order.selectedSize}</p>
              )}
              <p> total: {order.total}</p>
            </article>
          )
        })}
      </button>
    </section>
  )
}

OrderBasket.propTypes = {
  basketItems: PropTypes.array.isRequired
}
