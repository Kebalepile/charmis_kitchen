import React, { useState, useContext } from 'react'
import Loading from '../loading/Loading'
import Popup from '../popup/Popup'
import CustomerContext from '../../context/customer/context.jsx'
import PropTypes from 'prop-types'
import './profile.css'

const Profile = ({ onClose }) => {
  const { RequestProfileUpdate, UpdateCustomerProfile, CustomerLogout } =
    useContext(CustomerContext)
  const userProfile = JSON.parse(localStorage.getItem('profile')) || {}
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: userProfile.name || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
    password: '',
    confirmPassword: '',
    answers: ['', ''], // For security question answers
    securityQuestions: []
  })

  const closePopup = () => {
    setShowPopup(false)
    setPopupMessage('')
  }

  const handleEditChange = e => {
    const { name, value } = e.target
    if (name === 'name') {
      const lettersOnly = /^[A-Za-z\s]*$/
      if (!lettersOnly.test(value)) {
        setPopupMessage('Name should only contain letters.')
        setShowPopup(true)
        return
      }
    }

    if (name === 'phone') {
      const digitsOnly = /^\d{0,10}$/
      if (!digitsOnly.test(value)) {
        setPopupMessage('Phone number must contain a maximum of 10 digits.')
        setShowPopup(true)
        return
      }
    }

    setEditData(prevData => ({ ...prevData, [name]: value.trim() }))
  }

  const handleSaveProfile = async () => {
    const { name, phone, address, answers, password, confirmPassword } =
      editData

    // Validate inputs
    if (!name) {
      setPopupMessage('Name cannot be empty.')
      setShowPopup(true)
      return
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setPopupMessage('Name should only contain letters.')
      setShowPopup(true)
      return
    }
    if (!phone) {
      setPopupMessage('Phone field cannot be empty.')
      setShowPopup(true)
      return
    }
    if (phone.length > 10) {
      setPopupMessage('Phone number cannot exceed 10 digits.')
      setShowPopup(true)
      return
    }
    if (!address) {
      setPopupMessage('Address cannot be empty.')
      setShowPopup(true)
      return
    }
    if (answers.some(answer => !answer.trim())) {
      setPopupMessage('All security answers are required and cannot be empty.')
      setShowPopup(true)
      return
    }

    // Validate password fields
    if (password && password !== confirmPassword) {
      setPopupMessage('Passwords do not match.')
      setShowPopup(true)
      return
    }

    setLoading(true)
    try {
      const updateData = {
        ...editData,
        answers: answers.map(answer => answer.trim())
      }
      if (password) {
        updateData.password = password
      }

      if (phone !== userProfile.phone) {
        updateData.oldPhone = userProfile.phone
      }

      const res = await UpdateCustomerProfile(updateData)

      if (res?.error) {
        setPopupMessage(`${res.error}`)
      } else {
        setPopupMessage(
          res.message ||
            'Profile updated successfully. Please log in again with your phone and password.'
        )

        await CustomerLogout()
        localStorage.clear()
        setIsEditing(false)
      }
      setShowPopup(true)
    } catch (error) {
      setPopupMessage(`${error.message || 'Unexpected error occurred'}`)
      setShowPopup(true)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = async () => {
    setLoading(true)
    try {
      const res = await RequestProfileUpdate({
        resetUsername: userProfile?.name,
        resetPhone: userProfile?.phone
      })

      if (res?.error) {
        setPopupMessage(`${res.error}`)
        setShowPopup(true)
        setLoading(false)
        return
      }

      if (res?.securityQuestionOne && res?.securityQuestionTwo) {
        setEditData(prevData => ({
          ...prevData,
          securityQuestions: [res.securityQuestionOne, res.securityQuestionTwo]
        }))
      }

      setIsEditing(true)
    } catch (error) {
      setPopupMessage(`${error.message || 'Unexpected error occurred'}`)
      setShowPopup(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      name: userProfile.name || '',
      phone: userProfile.phone || '',
      address: userProfile.address || '',
      answers: ['', ''],
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className='profile-overlay'>
      <section id='customer-profile'>
        <div className='profile-header'>
          <h1>User Profile</h1>
          <button onClick={onClose} className='close-button'>
            Close
          </button>
          {!isEditing ? (
            <button onClick={handleEditProfile} className='edit-button'>
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSaveProfile} className='save-button'>
                Save
              </button>
              <button onClick={handleCancelEdit} className='cancel-button'>
                Cancel
              </button>
            </>
          )}
        </div>
        <div className='profile-details'>
          {isEditing ? (
            <>
              <label htmlFor='name'>
                <strong>Name:</strong>
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={editData.name}
                onChange={handleEditChange}
                placeholder='Enter your name'
              />

              <label htmlFor='phone'>
                <strong>Phone:</strong>
              </label>
              <input
                type='text'
                name='phone'
                id='phone'
                value={editData.phone}
                onChange={handleEditChange}
                placeholder='Enter your phone number'
              />

              <label htmlFor='address'>
                <strong>Address:</strong>
              </label>
              <input
                type='text'
                name='address'
                id='address'
                value={editData.address}
                onChange={handleEditChange}
                placeholder='Enter your address'
              />

              {editData.securityQuestions.map((question, index) => (
                <div key={index}>
                  <p>{question}</p>
                  <label htmlFor={`answer${index}`}>
                    <strong>Answer {index + 1}:</strong>
                  </label>
                  <input
                    type='text'
                    name={`answer${index}`}
                    id={`answer${index}`}
                    value={editData.answers[index]}
                    onChange={e => {
                      const answers = [...editData.answers]
                      answers[index] = e.target.value
                      setEditData(prevData => ({ ...prevData, answers }))
                    }}
                    placeholder='Your answer'
                  />
                </div>
              ))}

              <label htmlFor='password'>
                <strong>New Password:</strong>
              </label>
              <input
                type='password'
                name='password'
                id='password'
                value={editData.password}
                onChange={handleEditChange}
                placeholder='Enter new password'
              />

              <label htmlFor='confirmPassword'>
                <strong>Confirm Password:</strong>
              </label>
              <input
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                value={editData.confirmPassword}
                onChange={handleEditChange}
                placeholder='Confirm new password'
              />
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {userProfile?.name || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {userProfile?.phone || 'N/A'}
              </p>
              <p>
                <strong>Address:</strong> {userProfile?.address || 'N/A'}
              </p>
            </>
          )}
        </div>
      </section>
      {loading && (
        <div id='payment-overlay'>
          <Loading />
        </div>
      )}
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  )
}

Profile.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default Profile
