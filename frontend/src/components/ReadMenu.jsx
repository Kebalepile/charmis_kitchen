import React, { useContext } from 'react'
import MenuContext from '../context/menu/context'
import { MENU } from '../context/types'

export default function ReadMenu () {
  const { ReadMenu: RM, CloseMenu } = useContext(MenuContext)
  const menu = RM()
  const handleClick = () => {
    CloseMenu(MENU, false)
  }
  return (
    <section id='read-menu'>
      <p>{menu ? menu.name : 'No menu selected'}</p>
      <button id='close-menu' onClick={handleClick}>
        close menu
      </button>
    </section>
  )
}
