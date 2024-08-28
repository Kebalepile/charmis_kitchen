import React, { useState } from 'react'
import { MdClose } from 'react-icons/md' // Import the close icon
import PropTypes from 'prop-types' // Import PropTypes
import './bank.css'

function BankDetails ({ orderId, phone, paymentTotal, onClose }) {
  const [copiedButtonId, setCopiedButtonId] = useState(null)

  const copyText = (elementId, buttonId) => {
    const textToCopy = document.getElementById(elementId).innerText
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedButtonId(buttonId)
        setTimeout(() => {
          setCopiedButtonId(null)
        }, 4000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }

  return (
    <div className='bank-overlay'>
      <div className='bank-details'>
        <button className='close-button' onClick={onClose}>
          <MdClose size={24} />
        </button>
        <h2>Banking Details</h2>
        <p>
          <strong>Bank Name:</strong> Capitec Business
        </p>
        <p>
          <strong>Account Holder (Name):</strong>
          <span id='accountHolder'> BoitekongEats</span>
          <button
            id='copyAccountHolder'
            onClick={() => copyText('accountHolder', 'copyAccountHolder')}
          >
            {copiedButtonId === 'copyAccountHolder' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Account Number: </strong>
          <span id='accountNumber'>1052595359</span>
          <button
            id='copyAccountNumber'
            onClick={() => copyText('accountNumber', 'copyAccountNumber')}
          >
            {copiedButtonId === 'copyAccountNumber' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Branch Code: </strong>
          <span id='branchCode'>450105</span>
          <button
            id='copyBranchCode'
            onClick={() => copyText('branchCode', 'copyBranchCode')}
          >
            {copiedButtonId === 'copyBranchCode' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Reference (Beneficiary Reference): </strong>
          <span id='reference'> {orderId}</span>
          <button
            id='copyReference'
            onClick={() => copyText('reference', 'copyReference')}
          >
            {copiedButtonId === 'copyReference' ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p>
          <strong>Payment Total: </strong>R{paymentTotal}
        </p>
        <h3>Choose Payment method of your choice</h3>
        <hr />
        <h3>Via Banking App</h3>
        <ul>
          <li>
            <strong>For Capitec Banking App</strong>
            <hr />
            <ul>
              <li>Select Pay Beneficiary</li>
              <li>Click Add Benficiary</li>
              <li>
                Select Bank Account & Add Beneficiary Details using above
                mentioned banking details
              </li>
            </ul>
            <br />
          </li>
          <li>
            <strong>For other Banking Apps</strong>
            <hr />
            <ul>
              <li>Select &ldquo;Transfer&ldquo;</li>
              <li>Enter the account details and Reference Number</li>
              <li>Complete the payment</li>
            </ul>
          </li>
        </ul>

        <h3>Via ATM</h3>
        <hr />
        <ul>
          <li>Visit the nearest ATM</li>
          <li>Choose &ldquo;Deposit&ldquo; or &ldquo;Transfer&ldquo;</li>
          <li>Enter the account details and Reference Number</li>
          <li>Complete the payment</li>
        </ul>
        <br />
        <p>
          <strong>Please note:</strong> Time is limited. Payment must be made
          within 30 minutes to avoid order cancellation.
        </p>

        <p>
          <strong>Confirmation:</strong> You’ll receive an SMS confirmation
          within 10 minutes after payment. If not, please contact us at
          <span id='contactNumber'>
            <ul>
              <li>+(27) 67 271 8347 ( available on WhatsApp )</li>
              <li>
                <a href='mailto:boitekongeats@gmail.com'>
                  boitekongeats@gmail.com
                </a>
              </li>
            </ul>
          </span>
        </p>

        <button id='proceed' onClick={onClose}>
          I understand
        </button>
      </div>
    </div>
  )
}

BankDetails.propTypes = {
  orderId: PropTypes.number.isRequired,
  phone: PropTypes.string.isRequired,
  paymentTotal: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
}

export default BankDetails
