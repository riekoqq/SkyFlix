import {
    SUBSCRIBE_REQUEST,
    SUBSCRIBE_SUCCESS,
    SUBSCRIBE_FAIL,
    SUBSCRIBE_RESET,
    PAYMENT_SAVE_METHOD,
} from '../constants/subscriptionConstants';

const initialState = {
    loading: false,
    success: false,
    error: null,
};

export const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBSCRIBE_REQUEST:
            return { ...state, loading: true, success: false };
        case SUBSCRIBE_SUCCESS:
            return { loading: false, success: true };
        case SUBSCRIBE_FAIL:
            return { loading: false, error: action.payload };
        case SUBSCRIBE_RESET:
            return initialState;
        default:
            return state;
    }
};
export const paymentMethodReducer = (state = {}, action) => {
    switch (action.type) {
        case PAYMENT_SAVE_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        default:
            return state;
    }
};
