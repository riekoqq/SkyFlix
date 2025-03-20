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
    MOVIE_DETAILS_RESET,
    SEARCH_MOVIES_SUCCESS,
    SEARCH_MOVIES_FAIL,
    MOVIE_WATCH_HISTORY_REQUEST,
    MOVIE_WATCH_HISTORY_SUCCESS,
    MOVIE_WATCH_HISTORY_FAIL,
} from '../constants/movieConstants';

export const movieTopPicksReducer = (state = { movies: [] }, action) => {
    switch (action.type) {
        case MOVIE_TOP_PICKS_REQUEST:
            return { loading: true, movies: [] };
        case MOVIE_TOP_PICKS_SUCCESS:
            return { loading: false, movies: action.payload };
        case MOVIE_TOP_PICKS_FAIL:
            return { loading: false, error: action.payload }; // Ensure movies is always an array
        default:
            return state;
    }
};

export const movieRecentlyAddedReducer = (state = { movies: [] }, action) => {
    switch (action.type) {
        case MOVIE_RECENTLY_ADDED_REQUEST:
            return { loading: true, movies: [] };
        case MOVIE_RECENTLY_ADDED_SUCCESS:
            return { loading: false, movies: action.payload };
        case MOVIE_RECENTLY_ADDED_FAIL:
            return { loading: false, error: action.payload }; // Ensure movies is always an array
        default:
            return state;
    }
};

// Reducer for movie details
export const movieDetailsReducer = (state = { movie: {} }, action) => {
    switch (action.type) {
        case MOVIE_DETAILS_REQUEST:
            return { loading: true, ...state };
        case MOVIE_DETAILS_SUCCESS:
            return { loading: false, movie: action.payload };
        case MOVIE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case MOVIE_DETAILS_RESET:
            return { movie: {} };
        default:
            return state;
    }
};

export const searchMoviesReducer = (state = { movies: [] }, action) => {
    switch (action.type) {
        case SEARCH_MOVIES_SUCCESS:
            return { movies: action.payload };
        case SEARCH_MOVIES_FAIL:
            return { movies: [] };
        default:
            return state;
    }
};

export const movieWatchHistoryReducer = (state = { movies: [] }, action) => {
    switch (action.type) {
        case MOVIE_WATCH_HISTORY_REQUEST:
            return { loading: true, movies: [] };
        case MOVIE_WATCH_HISTORY_SUCCESS:
            return { loading: false, movies: action.payload };
        case MOVIE_WATCH_HISTORY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};