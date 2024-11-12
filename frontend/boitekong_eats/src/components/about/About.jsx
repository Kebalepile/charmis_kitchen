import React, { useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { GrContact } from "react-icons/gr";
import { Share } from "../../utils/Utils";

import "./about.css";

export default function About() {
  const [language, setLanguage] = useState("english");

  const founderImg = "./assets/images/qr_code.png";
  const englishContent = (
    <section>
      <img src={founderImg} alt="founder's image" className="founder-img" />

      <p>
        🍕 Welcome to Boitekong Eats, your takeout platform for authentic,
        homemade African cuisine! Established in 2024, we connect customers in
        Boitekong with home-based and township food vendors, offering convenient
        delivery or pickup of South African dishes.
      </p>

      <p>
        🍗 Our platform brings you the flavors of Boitekong’s rich culinary
        traditions, with each meal crafted by local vendors for an authentic
        township taste.
      </p>

      <p>
        🥘 Our mission is to empower local businesses, promote sustainability.
      </p>

      <p>
        🚴‍♂️ We uplift Boitekong by formalizing informal businesses, supporting
        women and youth, and driving sustainable growth for a thriving
        community.
      </p>

      <p>
        🙏 Thank you for supporting Boitekong Eats, where every order supports
        local entrepreneurs and sustainable development!
      </p>
    </section>
  );

  const setswanaContent = (
    <section>
      <img src={founderImg} alt="founder's image" className="founder-img" />
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
  );

  return (
    <div id="about">
      <GrContact />
      <h3>About</h3>
      <div>
        <button onClick={() => setLanguage("english")} className="lang-button">
          English 🇬🇧
        </button>
        <button onClick={() => setLanguage("setswana")} className="lang-button">
          Setswana 🇿🇦
        </button>
      </div>
      {language === "english" ? englishContent : setswanaContent}
      <button
        id="share-btn"
        className="apply share"
        title="share this food ordering web-app"
        onClick={() => {
          Share({
            title: "B-Town Bites",
            text: "Check out Boitekong Eats, your go for homemade food!",
            url: location.origin
          });
        }}
      >
        <GoShareAndroid />
      </button>
    </div>
  );
}
