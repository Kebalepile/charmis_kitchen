import React from 'react'
import PropTypes from 'prop-types'
import "./popup.css"

const Popup = ({ message, onClose }) => {
  return (
    <div id='popup-overlay'>
      <div id='popup'>
        <div
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Popup
