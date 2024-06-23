import React from 'react'
import ReactDOM from 'react-dom/client'
import MenuProvider from './context/menu/state.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MenuProvider>
      <App />
    </MenuProvider>
  </React.StrictMode>
)
