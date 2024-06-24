import React, { useReducer } from 'react'
import MenuContext from './context'
import PropTypes from 'prop-types'
import Reducer from './reducer'
import { MENU, OPEN_MENU } from '../types'

export default function MenuProvider ({ children }) {
  const initialState = {
    PIZZA_MENU: { name: 'Pizza menu' },
    CHICKEN_MENU: { name: 'Chicken menu' },
    COMPLETE_MENU: { name: 'Complete menu' },
    MENU: false,
    OPEN_MENU: null
  }
  const [state, dispatch] = useReducer(Reducer, initialState)

  const OpenMenu = (type, bool) => {
    // console.log('openmenu method:', type)
    dispatch({
      type: MENU,
      payload: {
        MENU: bool
      }
    })
  }
  const CloseMenu = (type, bool) => {
    // console.log('closemenu method:', type)
    dispatch({
      type: MENU,
      payload: {
        MENU: bool
      }
    })
  }
  const ChooseMenu = type => {
    // console.log('choosenmenu method:', type)
    dispatch({
      type: OPEN_MENU,
      payload: { OPEN_MENU: state[type] }
    })
  }

  const ReadMenu = () => {
    // console.log('readmenu method')
    return state.OPEN_MENU
  }

  return (
    <MenuContext.Provider
      value={{ OpenMenu, CloseMenu, ChooseMenu, ReadMenu, MENU: state.MENU }}
    >
      {children}
    </MenuContext.Provider>
  )
}

MenuProvider.propTypes = {
  children: PropTypes.node.isRequired
}
