import React, { useContext } from 'react'
import MenuContext from '../../../context/menu/context'
import { MENU, DIKUKU_MENU } from '../../../context/types'
import { RiCake3Fill } from 'react-icons/ri'

export default function DikukuMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU, true)
    ChooseMenu(DIKUKU_MENU)
  }
  return (
    <button className='menu-btn' onClick={handleClick}>
      <RiCake3Fill /> Di kuku
    </button>
  )
}
