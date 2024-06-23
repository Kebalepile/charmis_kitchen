import React, { useContext } from 'react'
import { FaBookOpen } from 'react-icons/fa'
import MenuContext from '../../../context/menu/context'
import { MENU, CHICKEN_MENU } from '../../../context/types'

export default function ChickenMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU)
    ChooseMenu(CHICKEN_MENU)
  }
  return (
    <section id='chicken-menu'>
      <button className='menu-btn' onClick={handleClick}>
        chicken <FaBookOpen />
      </button>
    </section>
  )
}
