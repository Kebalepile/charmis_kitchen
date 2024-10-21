import React from 'react';
import './PaymentLogos.css'; 

const PaymentLogos = () => {
  return (
    <div className="payment-logos-container">
      <p className="payment-logos-text">
        We accept a wide range of payment methods for your convenience:
      </p>
      <div className="payment-logos">
        <img src="/assets/images/yoco.svg" alt="Yoco" />
        <img src="/assets/images/eft.svg" alt="Instant EFT" />
        <img src="/assets/images/visa.svg" alt="Visa" />
        <img src="/assets/images/mastercard.svg" alt="Mastercard" />
        <img src="/assets/images/amex.svg" alt="American Express" />
      </div>
    </div>
  );
};

export default PaymentLogos;
