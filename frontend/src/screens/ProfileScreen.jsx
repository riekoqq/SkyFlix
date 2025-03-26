import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userProfile } from "../actions/userActions";
import "../styles/ProfileScreen.css"; // Single import is enough

const ProfileScreen = () => {
  const dispatch = useDispatch();

  // Access user profile state from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Access loading and error state from Redux store
  const userProfileState = useSelector((state) => state.userProfile);
  const { loading, error } = userProfileState;

  useEffect(() => {
    if (!userInfo) {
      dispatch(userProfile());
    }
  }, [dispatch]);

  return (
    <div className="profile-screen">
      {loading ? (
        <div className="loading">
          <p>Loading...</p>
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="error">
          <p className="error-message">{error}</p>
        </div>
      ) : userInfo ? (
        <div className="profile-info">
          <h2>User Profile</h2>
          <h3>Email: {userInfo.email}</h3>
          <p>Role: {userInfo.role}</p> {/* Displaying user role */}
          <p>
            <Link to="/payment" className="link">
              Go to payment screen
            </Link>
          </p>
        </div>
      ) : (
        <p>No user data available.</p> // Fallback for unexpected empty userInfo
      )}
    </div>
  );
};

export default ProfileScreen;
