import React from 'react'

import './loading.css'
export default function Loading () {
  return (
    <div className='loading-container'>
      <div className='loading-dot' style={{ '--i': 1 }}></div>
      <div className='loading-dot' style={{ '--i': 2 }}></div>
      <div className='loading-dot' style={{ '--i': 3 }}></div>
    </div>
  )
}
