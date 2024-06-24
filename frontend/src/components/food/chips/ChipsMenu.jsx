import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, CHIPS_MENU } from '../../../context/types'
import { FaBookOpen } from 'react-icons/fa'

export default function ChipsMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(CHIPS_MENU)
  }
  return (
    <section id='pizza-menu'>
      <button className='menu-btn' onClick={handleClick}>
        Chips <FaBookOpen />
      </button>
    </section>
  )
}
