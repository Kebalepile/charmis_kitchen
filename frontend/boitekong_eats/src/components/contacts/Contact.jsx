import React, { useState, useEffect } from 'react'
import { HiMegaphone } from 'react-icons/hi2'
import { FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Popup from '../popup/Popup'
import PaymentLogos from '../payment/PaymentLogos'
import termsAndConditions from '../../assets/policies/termsAndConditions'
import capitecLogo from '../../assets/images/capitec-logo.svg'

import './contact.css'

export default function Contact () {
  const [popupMessage, setPopupMessage] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [isContactVisible, setIsContactVisible] = useState(false) // Track visibility of contact section

  const closePopup = () => setShowPopup(false)

  useEffect(() => {
    const contactSection = document.getElementById('contact')

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsContactVisible(entry.isIntersecting) // Update state based on visibility
      },
      { threshold: 0.1 } // Trigger when 10% of the contact section is visible
    )

    if (contactSection) {
      observer.observe(contactSection)
    }

    return () => {
      if (contactSection) {
        observer.unobserve(contactSection)
      }
    }
  }, [])

  return (
    <>
      <section id='contact'>
        <HiMegaphone id='megaphone' />
        <h3>Contact Us</h3>
        <p>
          For any inquiries or immediate assistance, please reach out to us via
          WhatsApp or email:
        </p>
        <ul id='contact-details'>
          <li>
            <FaWhatsapp className='WhatsApp-icon' style={{marginRight:"8px", width:"20px"}}/>
           
             <a href='https://wa.me/27698488813' target='_blank'>
               +(27)6 9848 8813
            </a>
          </li>
          <li>
            <MdEmail className='Email-icon' style={{marginRight:"8px", width:"20px"}}/>
           
            <a href='mailto:boitekongeats@gmail.com'>boitekongeats@gmail.com</a>
          </li>
        </ul>
        <p>
          We’re here to help with your orders, feedback, or any questions you
          might have. Want to sell food with Boitekong Eats? Just use the
          contact details above to get in touch.
        </p>
        <PaymentLogos />
        <section id='bank_account'>
          <img src={capitecLogo} alt='Capitec Bank Logo' id='capitecLogo' />
          <hr />
          <strong>Banking Details</strong>
          <p><strong>Bank Name: </strong> Capitec Business</p>
          <p><strong>Account Holder: </strong> BoitekongEats</p>
          <p><strong>Account Number: </strong> 1052595359</p>
          <p><strong>Branch Code: </strong> 450105</p>
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

      {/* WhatsApp Chat Button (conditionally shown) */}
      {isContactVisible && (
        <div id='WhatsApp-chat'>
          <a className='WhatsApp-link' href='https://wa.me/27698488813' target='_blank'>
            <span className="icon-wrapper">
              <FaWhatsapp className='WhatsApp-icon' />
            </span>
            Chat with us
          </a>
        </div>
      )}
    </>
  )
}
