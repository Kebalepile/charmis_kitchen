import React from 'react'
import ReactDOM from 'react-dom/client'
import MenuProvider from './context/menu/state.jsx'
import OrderProvider from './context/order/state.jsx'
import PaymentProvider from './context/payment/state.jsx'
import App from './App.jsx'
import './index.css'


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    //   ./src/serviceWorker.js for development
    // ./serviceWorker.js for Production
    navigator.serviceWorker
      .register("./src/serviceWorker.js")
      .then((registration) => {
        console.log("service worker registered as: ", registration.scope);
      })
      .catch((error) => console.error("service worker registration: ", error));
  });
}

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
