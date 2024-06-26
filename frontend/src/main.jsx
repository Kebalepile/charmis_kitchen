import React from 'react'
import ReactDOM from 'react-dom/client'
import MenuProvider from './context/menu/state.jsx'
import OrderProvider from './context/order/state.jsx'
import PaymentProvider from './context/payment/state.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MenuProvider>
      <OrderProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </OrderProvider>
    </MenuProvider>
  </React.StrictMode>
)
