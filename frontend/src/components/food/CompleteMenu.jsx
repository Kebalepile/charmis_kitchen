import React, { useContext } from 'react'
import MenuContext from '../../context/menu/context'
import { MENU, COMPLETE_MENU } from '../../context/types'

import { GiBookmarklet } from 'react-icons/gi'

export default function CompleteMenu () {
  const { OpenMenu, ChooseMenu } = useContext(MenuContext)
  const handleClick = () => {
    OpenMenu(MENU)
    ChooseMenu(COMPLETE_MENU)
  }
  return (
    <section id='entire-menu'>
      <button className='menu-btn' onClick={handleClick}>
        Entire Menu <GiBookmarklet />
      </button>
    </section>
  )
}
