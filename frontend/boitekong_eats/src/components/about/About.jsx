import React, { useState } from 'react'
import { GoShareAndroid } from 'react-icons/go'
import { GrContact } from 'react-icons/gr'
import { Share } from '../../utils/Utils'

import './about.css'

export default function About () {
  const [language, setLanguage] = useState('english')

  const founderImg = './assets/images/qr_code.png'
  const englishContent = (
    <section>
      <img src={founderImg} alt="founder's image" className='founder-img' />

      <p>
        🍕 Welcome to Boitekong Eats, your go-to platform for authentic,
        homemade African cuisine! Established in 2024, we connect home-based
        food sellers and township vendors in Boitekong with customers who crave
        the rich flavors of South African dishes. Our platform allows
        local vendors to list their menus online, offering convenient delivery
        or collection options for customers looking to enjoy freshly prepared,
        homemade meals.
      </p>

      <p>
        🍗 Boitekong Eats proudly serves as a bridge between customers and the
        culinary traditions of our community. We specialize in South African township
        cuisine. Every dish is made with care by
        independent vendors who bring their unique touch to each meal, offering
        an authentic taste of Boitekong’s rich food culture.
      </p>

      <p>
        🥘 Our mission is not only to deliver delicious food but to empower
        local home-based businesses. By providing them with a digital platform,
        we help them reach a wider audience, grow their businesses, and thrive
        in today’s economy. We are also dedicated to job creation, especially
        for the youth, through our eco-friendly bicycle delivery service. This
        initiative promotes sustainability while offering young people a chance
        to develop skills and earn a living within their community.
      </p>

      <p>
        🚴‍♂️ At Boitekong Eats, we believe in creating lasting change. By
        formalizing informal businesses, empowering women and youth, and
        promoting sustainable development, we aim to uplift our community while
        preserving its culinary heritage. Our vision is to transform small food
        businesses into structured, thriving enterprises that contribute to the
        local economy.
      </p>

      <p>
        🙏 Thank you for choosing Boitekong Eats, where every order supports
        local entrepreneurs and helps foster sustainable growth within our
        community. We hope you enjoy the homemade flavors as much as we enjoy
        bringing them to you!
      </p>
    </section>
  )

  const setswanaContent = (
    <section>
      <img src={founderImg} alt="founder's image" className='founder-img' />
      <p>
        🍕 Dumelang! Re a go amogela mo Boitekong Eats, lefelo la gago la dijo
        tsa malatsi otlhe tse di phepafetseng, tse di dirilweng ka lorato le
        boineelo.
      </p>
      <p>
        🍗 Mo Boitekong Eats, re dira ka natla go netefatsa gore dijo tsa rona
        di goroga ka nako, di ntse di le foreshe mme di le monate.
      </p>
      <p>
        🥘 Re leboga kago re tshegetsa, mme re solofela gore o tla itumelela
        dijo tsa rona fela jaaka re itumelela go di go abela. Re a leboga! 🙏
      </p>
    </section>
  )

  return (
    <div id='about'>
      <GrContact />
      <h3>About</h3>
      <div>
        <button onClick={() => setLanguage('english')} className='lang-button'>
          English 🇬🇧
        </button>
        <button onClick={() => setLanguage('setswana')} className='lang-button'>
          Setswana 🇿🇦
        </button>
      </div>
      {language === 'english' ? englishContent : setswanaContent}
      <button
        id='share-btn'
        className='apply share'
        title='share this food ordering web-app'
        onClick={() => {
          Share({
            title: 'B-Town Bites',
            text: 'Check out Boitekong Eats, your go for homemade food!',
            url: location.origin
          })
        }}
      >
        <GoShareAndroid />
      </button>
    </div>
  )
}
