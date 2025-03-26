import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from '../actions/userActions'; // adjust the import path if necessary
import '../styles/ProfileScreen.css'; // Ensure you import the appropriate CSS if needed

const ProfileScreen = () => {
  const dispatch = useDispatch();

  // Access the user profile data from Redux store
  const userProfileState = useSelector(state => state.userProfile);
  const { loading, error, userInfo } = userProfileState;

  // Get user information
  useEffect(() => {
    if (!userInfo) {
      dispatch(userProfile()); // Dispatch the action to fetch user profile
    }
  }, [dispatch, userInfo]);

  return (
    <div className="profile-screen">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {userInfo && (
        <div>
            <h2>User Profile</h2>
            <h3>Email: {userInfo.email}</h3>
            <p>Role: {userInfo.role}</p> {/* Displaying the user's role */}
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
