import React from 'react'
import { MdMenuBook } from 'react-icons/md'
import logo from '../assets/1.png'
export default function Navbar () {
  return (
    <nav>
      <MdMenuBook id='side-bar' title="checkout menu" />

      <img src={logo} alt='logo' id='logo' title="charmi's kitchen" />
    </nav>
  )
}
