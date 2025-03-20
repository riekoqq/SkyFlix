import {
    BOOKMARK_ADD_REQUEST,
    BOOKMARK_ADD_SUCCESS,
    BOOKMARK_ADD_FAIL,
    BOOKMARK_REMOVE_REQUEST,
    BOOKMARK_REMOVE_SUCCESS,
    BOOKMARK_REMOVE_FAIL,
    BOOKMARK_LIST_REQUEST,
    BOOKMARK_LIST_SUCCESS,
    BOOKMARK_LIST_FAIL,
  } from '../constants/bookmarkConstants';
import axios from 'axios';
  
export const addBookmark = (movieId) => async (dispatch, getState) => {
    try {
        dispatch({ type: BOOKMARK_ADD_REQUEST });

        const { userLogin: { userInfo } } = getState();

        await axios.post(`/api/bookmark/${movieId}/add/`, {}, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
        });

        dispatch({ type: BOOKMARK_ADD_SUCCESS, payload: movieId });
    } catch (error) {
        dispatch({
        type: BOOKMARK_ADD_FAIL,
        payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};
  
export const removeBookmark = (movieId) => async (dispatch, getState) => {
    try {
        dispatch({ type: BOOKMARK_REMOVE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        await axios.delete(`/api/bookmark/${movieId}/remove/`, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
        });

        dispatch({ type: BOOKMARK_REMOVE_SUCCESS, payload: movieId });
    } catch (error) {
        dispatch({
        type: BOOKMARK_REMOVE_FAIL,
        payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};

export const listBookmarks = () => async (dispatch, getState) => {
    try {
        dispatch({ type: BOOKMARK_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const { data } = await axios.get('/api/bookmark/', {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });

        dispatch({ type: BOOKMARK_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: BOOKMARK_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};
