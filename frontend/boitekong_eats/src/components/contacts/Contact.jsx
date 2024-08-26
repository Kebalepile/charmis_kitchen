import React, { useState } from 'react'
import { HiMegaphone } from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Popup from '../popup/Popup'
import termsAndConditions from '../../assets/policies/termsAndConditions'

import './contact.css'

export default function Contact () {
  const [popupMessage, setPopupMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const closePopup = () => setShowPopup(false)

  return (
    <section id='contact'>
      <HiMegaphone id="megaphone" />
      <h3>Contact Us</h3>
      <p>
        For any inquiries or immediate assistance, please reach out to us via
        WhatsApp or email:
      </p>
      <ul id='contact-details'>
        <li>
          <FaWhatsapp
            style={{
              color: '#25D366',
              marginRight: '10px',
              fontSize: '24px'
            }}
          />
          <strong>+(27) 67 271 8347</strong>
        </li>
        <li>
          <MdEmail
            style={{
              color: 'gray',
              marginRight: '10px',
              fontSize: '24px'
            }}
          />
          <a href='mailto:boitekongeats@gmail.com'>boitekongeats@gmail.com</a>
        </li>
      </ul>
      <br />
      <p>
        We’re here to help with your orders, feedback, or any questions you
        might have. Feel free to contact us! Want to sell food with Boitekong
        Eats? Just use the contact details above to get in touch with us.
      </p>
      <button
        id='read_terms'
        type='button'
        onClick={() => {
          setPopupMessage(termsAndConditions)
          setShowPopup(true)
        }}
      >
        Read Terms & Conditions
      </button>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </section>
  )
}
