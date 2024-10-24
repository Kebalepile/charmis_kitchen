import React from 'react'
import ReactDOM from 'react-dom/client'
import MenuProvider from './context/menu/state.jsx'
import OrderProvider from './context/order/state.jsx'
import PaymentProvider from './context/payment/state.jsx'
import CustomerProvider from './context/customer/state.jsx'
import App from './App.jsx'
import './index.css'

// Define the deferred prompt variable globally
let deferredPrompt

// Listen for the beforeinstallprompt event to handle PWA installation
window.addEventListener('beforeinstallprompt', e => {
  console.log('beforeinstallprompt event fired')
  e.preventDefault()
  deferredPrompt = e
  sessionStorage.setItem('deferredPrompt', 'true')
})

// Export the deferred prompt for other components to use
export { deferredPrompt }

// Add a scroll event listener to toggle the sticky class on the navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar')
  if (window.scrollY > 0) {
    navbar.classList.add('sticky')
  } else {
    navbar.classList.remove('sticky')
  }
})

// Ensure createRoot is called only once
const container = document.getElementById('root')
if (!container._reactRootContainer) {
  // Initialize React Root and store it to avoid reinitialization
  const root = ReactDOM.createRoot(container)
  container._reactRootContainer = root

  // Render the App component within the root
  root.render(
    <React.StrictMode>
      <MenuProvider>
        <OrderProvider>
          <PaymentProvider>
            <CustomerProvider>
              <App />
            </CustomerProvider>
          </PaymentProvider>
        </OrderProvider>
      </MenuProvider>
    </React.StrictMode>
  )
}
