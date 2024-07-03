import React from 'react'
import { HiMegaphone } from 'react-icons/hi2'
import { FaPhone, FaEnvelope } from 'react-icons/fa'

export default function Contact () {
  return (
    <section id='contact'>
      <hr className='bg-hr' />
      <HiMegaphone />
      <h3>Contact</h3>
      <p>
        For inquiries, please call or WhatsApp:
        <br />
        <FaPhone
          style={{
            color: 'green',
            marginRight: '5px',
            transform: 'rotate(90deg)'
          }}
        />{' '}
        067 271 8347
        <br />
        <FaPhone
          style={{
            color: 'green',
            marginRight: '5px',
            transform: 'rotate(90deg)'
          }}
        />{' '}
        073 775 7160
      </p>
      <p>
        <FaEnvelope style={{ color: 'gray', marginRight: '5px' }} /> Email us
        at: <a href='mailto:kmotshoana@gmail.com'>kmotshoana@gmail.com</a>
      </p>
      <p>
        Feel free to reach out for orders, feedback, or any other questions. We
        are here to help!
      </p>
    </section>
  )
}
