// userActions.js
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL
} from '../constants/userConstants';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            '/api/users/login',
            { email, password },
            config
        );

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        // Save token and user info
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
};

export const register = (email, password, role = 'free') => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            '/api/users/register',
            { email, password, role },
            config
        );

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

        // Automatically log the user in after registration
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // Store the data in localStorage to persist the session
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const userProfile = () => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_PROFILE_REQUEST });
  
      const { userLogin } = getState();
      const token = userLogin?.userInfo?.token;
  
      const response = await fetch("/api/users/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Fetched User Profile:", data);
  
      dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: USER_PROFILE_FAIL, payload: error.message });
    }
  };
  