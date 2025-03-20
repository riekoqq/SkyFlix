import { WATCH_HISTORY_REQUEST, WATCH_HISTORY_SUCCESS, WATCH_HISTORY_FAIL } from '../constants/watchHistoryConstants';

export const watchHistoryReducer = (state = {}, action) => {
    switch (action.type) {
        case WATCH_HISTORY_REQUEST:
            return { loading: true };
        case WATCH_HISTORY_SUCCESS:
            return { loading: false, success: true, data: action.payload };
        case WATCH_HISTORY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
