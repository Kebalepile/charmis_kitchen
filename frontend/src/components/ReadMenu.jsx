import React, { useContext } from 'react'
import MenuContext from '../context/menu/context'

export default function ReadMenu () {
  const { ReadMenu } = useContext(MenuContext)
  return <section id='read-menu'>{ReadMenu()}</section>
}
