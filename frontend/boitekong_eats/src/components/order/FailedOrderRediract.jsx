import React from 'react'

const FailedOrderRediract = () => {
  window.location.href = '/orderfailure.html' // Redirect to the static HTML file
  return null // This prevents rendering any JSX while redirecting
}

export default FailedOrderRediract
