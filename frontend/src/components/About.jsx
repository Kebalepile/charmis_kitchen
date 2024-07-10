import React, { useState } from 'react'
import { GoShareAndroid } from 'react-icons/go'
import { GrContact } from 'react-icons/gr'
import founderImg from '../assets/images/julia.jpg'
import { Share } from '../utils/Utils'

export default function About () {
  const [language, setLanguage] = useState('setswana')

  const englishContent = (
    <section>
      <img src={founderImg} alt="founder's image" className='founder-img' />
      <p>
        🍕 Welcome to Boitekong Eats, your go for homemade food! We specialize in
        offering a variety of delicious homemade dishes, drinks, all available
        for prepaid order.
      </p>
      <p>
        🍗 At Boitekong Eats, we pride ourselves on serving homemade African
        township cuisine. From magwinya and chicken wings to pizza and baked
        cookies, we have something to satisfy every craving.
      </p>
      <p>
        🥘 Our goal is to ensure that our food arrives fresh and tasty,
        providing you with a delightful experience of traditional Setswana
        meals. Thank you for your support, and we hope you enjoy our food as
        much as we enjoy making it for you! 🙏
      </p>
    </section>
  )

  const setswanaContent = (
    <section>
      <img src={founderImg} alt="founder's image" className='founder-img' />
      <p>
        🍕 Dumelang! Re a go amogela mo Boitekong Eats, lefelo la gago la dijo tsa
        malatsi otlhe tse di phepafetseng, tse di dirilweng ka lorato le
        boineelo.
      </p>
      <p>
        🍗 Mo Boitekong Eats, re dira ka natla go netefatsa gore dijo tsa rona di
        goroga ka nako, di ntse di le foreshe mme di le monate.
      </p>
      <p>
        🥘 Re leboga kago re tshegetsa, mme re solofela gore o tla itumelela
        dijo tsa rona fela jaaka re itumelela go di go abela. Re a leboga! 🙏
      </p>
    </section>
  )

  return (
    <div id='about'>
      <button
        id='share-btn'
        className='apply share'
        title="shaere this site"
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
      <hr className='bg-hr' />

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
    </div>
  )
}
