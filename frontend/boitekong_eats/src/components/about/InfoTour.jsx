import React, { useState, useEffect } from "react";
import "./InfoTour.css";

const InfoTour = () => {
  const yocoLogo = "/assets/images/yoco.svg",
    eftLogo = "/assets/images/eft.svg",
    visaLogo = "/assets/images/visa.svg",
    masterCardLogo = "/assets/images/mastercard.svg",
    boitekongEatsLogo = "/assets/images/boitekong-eats-logo.png",
    deliveryIcon = "/assets/images/bike_icon.jpg",
    communityIcon = "/assets/images/community_icon.png";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTour, setShowTour] = useState(false);

  // Check localStorage for infoTourComplete on component mount
  useEffect(() => {
    const tourComplete = localStorage.getItem("infoTourComplete") === "true";
    if (!tourComplete) {
      setShowTour(true);
    }
  }, []);

  // Onboarding tour slides content
  const slides = [
    {
      text: "🍲 Welcome to Boitekong Eats, your township takeout & ordering service!",
      image: boitekongEatsLogo,
    },
    {
      text: "📦 Order now for delivery or self-collect. Your choice, your convenience!",
      image: deliveryIcon,
    },
    {
      text: "💳 Pay safely online with Yoco. We accept Visa, MasterCard & more!",
      image: [yocoLogo, masterCardLogo, visaLogo, eftLogo],
    },
    {
      text: "🌍 Every order helps support local businesses in Boitekong. Feel good, eat good!",
      image: communityIcon,
    },
    {
      text: "🚀 We are youth-centered and focused on innovation. Let's thrive together!",
      image: communityIcon,
    },
  ];

  // Handle next button click
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Handle skip button click
  const handleSkip = () => {
    setInfoTourComplete();
    setShowTour(false);
  };

  // Handle done button click
  const handleDone = () => {
    setInfoTourComplete();
    setShowTour(false);
  };

  // Set infoTourComplete in localStorage
  const setInfoTourComplete = () => {
    localStorage.setItem("infoTourComplete", "true");
  };

  return (
    showTour && (
      <div className="info-tour">
        <div className="info-tour-background"></div>
        <div className="info-tour-content">
          {/* Left Arrow for Traversal */}
          {currentSlide > 0 && (
            <button className="slide-nav slide-nav-left" onClick={handlePrevious}>
            &#8249;
          </button>
          )}
          {/* Slide Image */}
          <img
            src={
              Array.isArray(slides[currentSlide].image)
                ? slides[currentSlide].image[0]
                : slides[currentSlide].image
            }
            alt="Slide Icon"
            className="tour-image"
          />
          {/* Display logos if it's a payment slide */}
          {Array.isArray(slides[currentSlide].image) && (
            <div className="tour-logos">
              {slides[currentSlide].image.map((src, idx) => (
                <img key={idx} src={src} alt="Payment Icon" className="logo-img" />
              ))}
            </div>
          )}
          {/* Slide Text */}
          <p className="tour-text">{slides[currentSlide].text}</p>
          {/* Navigation Buttons */}
          <div className="info-tour-buttons">
            {currentSlide < slides.length - 1 ? (
              <>
                <button className="skip-btn" onClick={handleSkip}>
                  Skip
                </button>
                <button className="next-btn" onClick={handleNext}>
                  Next
                </button>
              </>
            ) : (
              <button className="done-btn" onClick={handleDone}>
                Done
              </button>
            )}
          </div>
          {/* Right Arrow for Traversal */}
          {currentSlide < slides.length - 1 && (
            <button className="slide-nav slide-nav-right" onClick={handleNext}>
            &#8250;
          </button>
          )}
        </div>
      </div>
    )
  );
};

export default InfoTour;
