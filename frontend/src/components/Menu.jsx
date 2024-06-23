import React from 'react'
import PizzaMenu from './food/pizza/PizzaMenu'
import ChickenMenu from './food/chicken/ChickenMenu'

export default function Menu () {
  return (
    <section id='menu'>
      <h1>Menu</h1>
      <PizzaMenu />
      <ChickenMenu />
    </section>
  )
}
