import React from 'react'
import PropTypes from 'prop-types'
// import MenuContext from '../../context/menu/context'
// import { MENU, COMPLETE_MENU } from '../../context/types'
import { GiBookmarklet } from 'react-icons/gi'

const OrderBasket = ({ basketItems, updateBasketItems }) => {
  // const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    // OpenMenu(MENU, true)
    // ChooseMenu(COMPLETE_MENU)
    console.log("order basket button clicked")
  }

  const removeOrder = (index, arr) => {
    // Create a copy of the array to avoid mutating the original array
    const updatedArr = [...arr]

    // Check if the index is within the valid range
    if (index >= 0 && index < updatedArr.length) {
      // Remove the item at the given index
      updatedArr.splice(index, 1)
    }
    updateBasketItems(updatedArr)
  }

  return (
    <section id='entire-menu' className='order-basket'>
      <button className='menu-btn' onClick={handleClick}>
        Order Basket <GiBookmarklet />
      </button>
      <h3>Pending orders</h3>
      {basketItems.map((order, index) => (
        <article key={index} className='order-item'>
          <p> order number: {order.orderNumber}</p>
          <p> meal: {order.itemName}</p>
          <p> number of meal ordered: {order.quantity}</p>
          {order.selectedSize.length > 0 && (
            <p> meal size: {order.selectedSize}</p>
          )}
          <p> total: R{order.total}</p>
          <button className='pop' onClick={() => removeOrder(index, basketItems)}>
            remove
          </button>
        </article>
      ))}
    </section>
  )
}

OrderBasket.propTypes = {
  basketItems: PropTypes.array.isRequired,
  updateBasketItems: PropTypes.func.isRequired
}

export default OrderBasket
