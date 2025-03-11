import axios from 'axios';
import {
    MOVIE_LIST_REQUEST,
    MOVIE_LIST_SUCCESS,
    MOVIE_LIST_FAIL,
    MOVIE_DETAILS_REQUEST,
    MOVIE_DETAILS_SUCCESS,
    MOVIE_DETAILS_FAIL,
} from '../constants/movieConstants';

export const listMovies = () => async (dispatch) => {
    try {
        dispatch({ type: MOVIE_LIST_REQUEST });
        const { data } = await axios.get('/api/movies/');
        dispatch({
            type: MOVIE_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: MOVIE_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const listMovieDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: MOVIE_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/movies/${id}/`);

        // Construct video URL dynamically
        const videoURL = `${process.env.REACT_APP_API_URL || ''}/api/movies/${id}/video/`;

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
