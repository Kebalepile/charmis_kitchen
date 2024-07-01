import React, { useContext, useState } from 'react'
import OrderContext from '../context/order/context'
import OrderDisplay from './OrderDisplay'

export default function SearchOrder () {
  const { getOrder, orders } = useContext(OrderContext)
  const [orderNumber, setOrderNumber] = useState('')

  const handleSearch = async e => {
    e.preventDefault()
    await getOrder(orderNumber)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          placeholder='Enter order number'
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
      {orders && <OrderDisplay />}
    </div>
  )
}
