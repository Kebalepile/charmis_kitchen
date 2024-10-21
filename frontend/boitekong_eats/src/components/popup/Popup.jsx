import React from 'react'
import PropTypes from 'prop-types'
import './popup.css'

const Popup = ({ message, onClose }) => {
  return (
    <div className='popup-overlay'>
      <div className='popup'>
        <div
          dangerouslySetInnerHTML={{ __html: message }}
        />
       
        <div className='loading-dots'>
          <span className='dot'></span>
          <span className='dot'></span>
          <span className='dot'></span>
        </div>
        <button onClick={onClose}>ok</button>
      </div>
    </div>
  )
}

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Popup
