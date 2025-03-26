import {
    SUBSCRIBE_REQUEST,
    SUBSCRIBE_SUCCESS,
    SUBSCRIBE_FAIL,
    PAYMENT_SAVE_METHOD
} from '../constants/subscriptionConstants';
import { USER_LOGIN_SUCCESS } from '../constants/userConstants';
import axios from 'axios';

export const subscribe = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SUBSCRIBE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Make the subscription request
        const { data } = await axios.post('/api/subscribe/', {}, config);

        dispatch({ type: SUBSCRIBE_SUCCESS, payload: data });

        // Ensure access and refresh tokens are provided
        if (!data.access || !data.refresh) {
            throw new Error("Token refresh failed. Please log in again.");
        }

        const updatedUserInfo = {
            ...userInfo,
            role: 'premium',
            token: data.access,
            refresh: data.refresh,
        };

        dispatch({ type: USER_LOGIN_SUCCESS, payload: updatedUserInfo });

        // Store updated user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        
    } catch (error) {
        console.error("Subscription Error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            // If unauthorized, force logout
            localStorage.removeItem('userInfo');
            dispatch({ type: USER_LOGIN_SUCCESS, payload: {} });
        }

        dispatch({
            type: SUBSCRIBE_FAIL,
            payload: error.response?.data?.detail || error.message,
        });
    }
};

export const savePaymentMethod = (paymentMethod) => (dispatch) => {
    dispatch({
        type: PAYMENT_SAVE_METHOD,
        payload: paymentMethod,
    });
};
