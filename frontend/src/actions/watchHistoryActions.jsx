import axios from 'axios';
import { WATCH_HISTORY_REQUEST, WATCH_HISTORY_SUCCESS, WATCH_HISTORY_FAIL } from '../constants/watchHistoryConstants';

export const logWatchHistory = (movieId) => async (dispatch, getState) => {
    try {
        dispatch({ type: WATCH_HISTORY_REQUEST });

        const { userLogin: { userInfo } } = getState();
        
        if (!userInfo) {
            throw new Error("User not logged in");
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post('/api/movies/log-watch-history/', { movie_id: movieId }, config);

        dispatch({ type: WATCH_HISTORY_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: WATCH_HISTORY_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};
