// movieActions.js
import axios from 'axios';
import {
    MOVIE_TOP_PICKS_REQUEST,
    MOVIE_TOP_PICKS_SUCCESS,
    MOVIE_TOP_PICKS_FAIL,
    MOVIE_RECENTLY_ADDED_REQUEST,
    MOVIE_RECENTLY_ADDED_SUCCESS,
    MOVIE_RECENTLY_ADDED_FAIL,
    MOVIE_DETAILS_REQUEST,
    MOVIE_DETAILS_SUCCESS,
    MOVIE_DETAILS_FAIL,
    SEARCH_MOVIES_SUCCESS,
    SEARCH_MOVIES_FAIL,
    MOVIE_WATCH_HISTORY_REQUEST,
    MOVIE_WATCH_HISTORY_SUCCESS,
    MOVIE_WATCH_HISTORY_FAIL,
} from '../constants/movieConstants';


export const listTopPicks = () => async (dispatch, getState) => {
    try {
        dispatch({ type: MOVIE_TOP_PICKS_REQUEST });

        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

        const { data } = await axios.get('https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/top-picks/', config);

        dispatch({ type: MOVIE_TOP_PICKS_SUCCESS, payload: data.movies || [] }); // Ensure array
    } catch (error) {
        dispatch({
            type: MOVIE_TOP_PICKS_FAIL,
            payload: error.response?.data?.detail || error.message
        });
    }
};

// Fetch Recently Added Movies
export const listRecentlyAdded = () => async (dispatch) => {
    try {
        dispatch({ type: MOVIE_RECENTLY_ADDED_REQUEST });

        const { data } = await axios.get('https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/recently-added/');

        dispatch({ type: MOVIE_RECENTLY_ADDED_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: MOVIE_RECENTLY_ADDED_FAIL, 
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message 
        });
    }
};

export const listMovieDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: MOVIE_DETAILS_REQUEST });

        const config = {
            withCredentials: true,
        };
        

        const { data } = await axios.get(`https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/${id}/`, config);

        const videoURL = `${process.env.REACT_APP_API_URL || ''}https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/${id}/video/`;

        dispatch({
            type: MOVIE_DETAILS_SUCCESS,
            payload: { ...data, video: videoURL },
        });

    } catch (error) {
        dispatch({
            type: MOVIE_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const searchMovies = (query) => async (dispatch) => {
    try {
        const { data } = await axios.get(`https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/search/?q=${query}`);
        dispatch({ type: SEARCH_MOVIES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SEARCH_MOVIES_FAIL, payload: error.response?.data?.message || error.message });
    }
};

export const listWatchHistory = () => async (dispatch, getState) => {
    try {
        dispatch({ type: MOVIE_WATCH_HISTORY_REQUEST });

        const { userLogin: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

        const { data } = await axios.get('https://skyflix-backend-742023edbdaa.herokuapp.com/api/movies/watch-history/', config);

        dispatch({ type: MOVIE_WATCH_HISTORY_SUCCESS, payload: data.movies || [] });
    } catch (error) {
        dispatch({
            type: MOVIE_WATCH_HISTORY_FAIL,
            payload: error.response?.data?.detail || error.message
        });
    }
};