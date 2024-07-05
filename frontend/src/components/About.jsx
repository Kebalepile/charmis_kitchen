import React, { useState } from 'react';
import { GrContact } from 'react-icons/gr';
import founderImg from "../assets/images/julia.jpg";

export default function About() {
  const [language, setLanguage] = useState('setswana');

  const englishContent = (
    <section>
      <img src={founderImg} alt="founder's image" className="founder-img" />
      <p>
        🍕 Welcome to BtownBites, your go-to web app for homemade 
        food! We specialize in offering a variety of delicious homemade dishes
        and drinks, all available for prepaid order.
      </p>
      <p>
        🍗 At BtownBites, we pride ourselves on serving homemade African
        township cuisine. From magwinya and chicken wings to pizza and baked
        cookies, we have something to satisfy every craving.
      </p>
      <p>
        🥘 Our goal is to ensure that our food arrives fresh and tasty,
        providing you with a delightful experience of traditional Setswana
        meals. Thank you for your support, and we hope you enjoy our food as
        much as we enjoy making it for you!
      </p>
    </section>
  );

  const setswanaContent = (
    <section>
      <img src={founderImg} alt="founder's image" className="founder-img" />
      <p>
        🍕 Dumelang! Re a go amogela mo BtownBites, lefelo la gago la dijo
        tsa malatsi otlhe tse di phepafetseng. Re ikgantsha ka go go abela dijo
        tse di tlhotlhwa sentle tsa Setswana tse di mo godimo ga dipitsa tsa
        motse, tse di dirilweng ka lorato le boineelo.
      </p>
      <p>
        🍗 Mo BtownBites, re itsholela ka dijo tse di monate go tswa mo
        dipitsa tsa Setswana go fitlha mo menongwane ya di kuku. Ka dikgetho tse
        di jaaka pizza, malana a kana, magwinya, le dinkgwe tse di apeilweng, re
        na le sengwe le sengwe go kgotsofatsa matlalo a gago.
      </p>
      <p>
        🥘 Re dira ka natla go netefatsa gore dijo tsa rona di goroga ka nako,
        di ntse di le foreshe mme di le monate. Keletso ya rona ke go go naya
        phitlhelelo e e monate ya dijo tsa Setswana, tse di neng di tshela
        ditswa mo motseng.
      </p>
      <p>
        🙏 Re leboga kago re tshegetsa, mme re solofela gore o tla itumelela
        dijo tsa rona fela jaaka re itumelela go di go abela. Re a leboga!
      </p>
    </section>
  );

  return (
    <div id='about'>
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
  );
}
