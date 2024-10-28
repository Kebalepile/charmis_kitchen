import React from 'react';
import PropTypes from 'prop-types';

import './profile.css';

const Profile = ({ onClose }) => {
  const userProfile = JSON.parse(localStorage.getItem('profile')) || {};

  return (
    <div className="profile-overlay">
      <section id="customer-profile">
        <div className="profile-header">
          <h1>User Profile</h1>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
        <div className="profile-details">
          <p><strong>Name:</strong> {userProfile.name || 'N/A'}</p>
          <p><strong>Phone:</strong> {userProfile.phone || 'N/A'}</p>
          <p><strong>Address:</strong> {userProfile.address || 'N/A'}</p>
        </div>
      </section>
    </div>
  );
};

Profile.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default Profile;
