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
          <strong>Payment Total: </strong>R {paymentTotal}
        </p>
        <h3>Choose Payment method of your choice</h3>
        <hr />
        <h3>Via Banking App</h3>
        <ol>
          <li>Open your app</li>
          <li>
            For Capitec Banking App:
            <hr />
            <ol>
              <li>Select Pay Beneficiary</li>
              <li>Click Add Benficiary</li>
              <li>
                Select Bank Account & Add Beneficiary Details using above
                mentioned banking details
              </li>
            </ol>
          </li>
          <li>For other Banking Apps</li>
          <hr />
          <li>Select &ldquo;Transfer&ldquo;</li>
          <li>Enter the account details and Reference Number</li>
          <li>Complete the payment</li>
        </ol>

        <h3>Via ATM</h3>
        <ol>
          <li>Visit the nearest ATM</li>
          <li>Choose &ldquo;Deposit&ldquo; or &ldquo;Transfer&ldquo;</li>
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
          <strong>Confirmation:</strong> You’ll receive an SMS confirmation
          within 10 minutes after payment. If you don’t, contact us at
          <span id='contactNumber'> {phone}</span>
          <button
            id='copyContactNumber'
            onClick={() => copyText('contactNumber', 'copyContactNumber')}
          >
            {copiedButtonId === 'copyContactNumber' ? 'Copied' : 'Copy'}
          </button>
          .
        </p>

        {/* <p>
          <strong>Thank you for your payment!</strong> Your order is being
          processed.
        </p> */}
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
