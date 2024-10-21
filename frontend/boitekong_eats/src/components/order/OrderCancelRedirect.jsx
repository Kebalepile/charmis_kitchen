import React from 'react'

const OrderCancelRedirect = () => {
  window.location.href = '/ordercancel.html' // Redirect to the static HTML file
  return null // This prevents rendering any JSX while redirecting
}

export default OrderCancelRedirect
