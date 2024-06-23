import React, { useReducer } from 'react'
import MenuContext from './context'
import PropTypes from 'prop-types'
import Reducer from './reducer'
import { OPEN_MENU } from '../types'

export default function MenuProvider ({ children }) {
  const initialState = {
    PIZZA_MENU: { name: 'Pizza menu' },
    CHICKEN_MENU: { name: 'chicken menu' },
    COMPLETE_MENU: { name: 'complete menu' },
    MENU: false,
    OPEN_MENU: null
  }
  const [state, dispatch] = useReducer(Reducer, initialState)

  const OpenMenu = type => {
    dispatch({
      type,
      payload: {
        [type]: !state.Menu
      }
    })
  }
  const ChooseMenu = type => {
    dispatch({
      type: OPEN_MENU,
      payload: { OPEN_MENU: state[type] }
    })
    console.dir(state)
  }
  const ReadMenu = () => state.OPEN_MENU

  return (
    <MenuContext.Provider value={{ OpenMenu, ChooseMenu, ReadMenu , Menu: state.MENU}}>
      {children}
    </MenuContext.Provider>
  )
}

MenuProvider.propTypes = {
  children: PropTypes.node.isRequired
}
