import React, { useState } from 'react'
import { HiMegaphone } from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Popup from '../popup/Popup'
import termsAndConditions from '../../assets/policies/termsAndConditions'
import capitecLogo from '../../assets/images/capitec-logo.svg'

import './contact.css'

export default function Contact () {
  const [popupMessage, setPopupMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const closePopup = () => setShowPopup(false)

  return (
    <section id='contact'>
      <HiMegaphone id='megaphone' />
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
      <section id='bank_account'>
        <img src={capitecLogo} alt='Capitec Bank Logo' id='capitecLogo' />
       <hr/>
        <strong>Banking Details</strong>
        <p>
          <strong>Bank:</strong> Capitec Bank
        </p>
        <p>
          <strong>Account Holder:</strong>
          <span id='accountHolder'>K MOTSHOANA</span>
        </p>
        <p>
          <strong>Account Number:</strong>
          <span id='accountNumber'>1761303595</span>
        </p>
        <p>
          <strong>Branch Code:</strong>
          <span id='branchCode'>470010</span>
        </p>
      </section>
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
