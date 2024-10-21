import React from 'react'

const OrderSuccessRedirect = () => {
  window.location.href = '/ordersuccess.html' // Redirect to the static HTML file
  return null // This prevents rendering any JSX while redirecting
}

export default OrderSuccessRedirect
