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

export const bookmarkReducer = (state = { bookmarks: [] }, action) => {
    switch (action.type) {
        case BOOKMARK_ADD_REQUEST:
        case BOOKMARK_REMOVE_REQUEST:
        case BOOKMARK_LIST_REQUEST:
            return { ...state, loading: true };

        case BOOKMARK_ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                bookmarks: [...state.bookmarks, action.payload],
            };

        case BOOKMARK_REMOVE_SUCCESS:
            return {
                ...state,
                loading: false,
                bookmarks: state.bookmarks.filter(id => id !== action.payload),
            };

        case BOOKMARK_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                bookmarks: action.payload,  // Payload is full movie objects
            };

        case BOOKMARK_ADD_FAIL:
        case BOOKMARK_REMOVE_FAIL:
        case BOOKMARK_LIST_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
