import React, { useState } from 'react';
import { MdClose } from 'react-icons/md'; // Import the close icon
import PropTypes from 'prop-types'; // Import PropTypes
import './bank.css';

function BankDetails({ orderId }) {
  const [copiedButtonId, setCopiedButtonId] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

  const copyText = (elementId, buttonId) => {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedButtonId(buttonId);
        setTimeout(() => {
          setCopiedButtonId(null);
        }, 4000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleClose = () => {
    setIsVisible(false); // Set visibility to false when close button is clicked
  };

  if (!isVisible) {
    return null; // Render nothing if not visible
  }

  return (
    <div className='bank-overlay'>
      <div className='bank-details'>
        <button className='close-button' onClick={handleClose}>
          <MdClose size={24} />
        </button>
        <h2>Banking Details</h2>
        <p><strong>Bank:</strong> Capitec Bank</p>
        <p><strong>Account Holder:</strong> K MOTSHOANA</p>
        <p>
          <strong>Account Number:</strong>
          <span id='accountNumber'> 1761303595</span>
          <button
            id='copyAccountNumber'
            onClick={() => copyText('accountNumber', 'copyAccountNumber')}
          >
            {copiedButtonId === 'copyAccountNumber' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Branch Code:</strong>
          <span id='branchCode'> 470010</span>
          <button
            id='copyBranchCode'
            onClick={() => copyText('branchCode', 'copyBranchCode')}
          >
            {copiedButtonId === 'copyBranchCode' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Reference:</strong>
          <span id='reference'> {orderId}</span>
          <button
            id='copyReference'
            onClick={() => copyText('reference', 'copyReference')}
          >
            {copiedButtonId === 'copyReference' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <h3>Choose Payment method of your choice</h3>
        <hr />
        <h3>Via Banking App</h3>
        <ol>
          <li>Open your app</li>
          <li>Select "Transfer"</li>
          <li>Enter the account details and Reference Number</li>
          <li>Complete the payment</li>
        </ol>

        <h3>Via ATM</h3>
        <ol>
          <li>Visit the nearest ATM</li>
          <li>Choose "Deposit" or "Transfer"</li>
          <li>Enter the account details and Reference Number</li>
          <li>Complete the payment</li>
        </ol>

        <h3>Via USSD</h3>
        <ol>
          <li>Dial *120*3279# (Capitec) or your bank’s code</li>
          <li>Follow prompts to complete the payment</li>
          <li>Use the Reference Number when prompted</li>
        </ol>

        <p>
          <strong>Please note:</strong> Time is limited. Payment must be made
          within 30 minutes to avoid order cancellation.
        </p>

        <p>
          <strong>Confirmation:</strong>
          You’ll receive an SMS confirmation within 10 minutes after payment. If
          you don’t, contact us at
          <span id='contactNumber'> 555 555 555</span>
          <button
            id='copyContactNumber'
            onClick={() => copyText('contactNumber', 'copyContactNumber')}
          >
            {copiedButtonId === 'copyContactNumber' ? 'Copied' : 'Copy'}
          </button>
          .
        </p>

        <p>
          <strong>Thank you for your payment!</strong> Your order is being
          processed.
        </p>
      </div>
    </div>
  );
}

// Define PropTypes for the component
BankDetails.propTypes = {
  orderId: PropTypes.string.isRequired, // orderId is required and should be a string
};

export default BankDetails;
