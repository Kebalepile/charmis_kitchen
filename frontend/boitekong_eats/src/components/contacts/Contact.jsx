import React from 'react';
import { HiMegaphone } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon
import { MdEmail } from 'react-icons/md'; // Import a better-looking email icon

import './contact.css';

export default function Contact() {
  return (
    <section id='contact'>
  
      <HiMegaphone />
      <h3>Contact</h3>
      <p>
        For Inquiries, Please Call or WhatsApp:
        <br />
        <br />
        <ul>
          <li>
            <FaWhatsapp
              style={{
                color: '#25D366', // WhatsApp green color
                marginRight: '5px'
              }}
            />{' '}
            <strong>+(27) 67 271 8347</strong>
          </li>
          <li>
            {' '}
            <MdEmail style={{ color: 'gray', marginRight: '5px' }} />
            <a href='mailto:boitekongeats@gmail.com'>boitekongeats@gmail.com</a>
          </li>
        </ul>
      </p>

      <p>
        Feel free to reach out for orders, feedback, or any other questions. We
        are here to help!
      </p>
      <p className='vendor-inquiry'>
        If you want to become a vendor via Boitekong Eats and sell food, contact
        us at the above details.
      </p>
    </section>
  );
}
