import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from 'redux-thunk';
import { movieRecentlyAddedReducer, movieTopPicksReducer, movieWatchHistoryReducer, searchMoviesReducer } from "./reducers/movieReducers";
import { movieDetailsReducer } from "./reducers/movieReducers";
import { userLoginReducer } from "./reducers/userReducers";
import { watchHistoryReducer } from "./reducers/watchHistoryReducers";
import { bookmarkReducer } from "./reducers/bookmarkReducers";

const reducer = combineReducers({
    movieTopPicks: movieTopPicksReducer,
    movieRecentlyAdded: movieRecentlyAddedReducer,
    movieDetails: movieDetailsReducer,
    userLogin: userLoginReducer,
    searchMovies: searchMoviesReducer,
    watchHistory: watchHistoryReducer,
    movieWatchHistory: movieWatchHistoryReducer,
    bookmarks: bookmarkReducer
})

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
    reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;