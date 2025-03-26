import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from 'redux-thunk';
import { movieRecentlyAddedReducer, movieTopPicksReducer, movieWatchHistoryReducer, searchMoviesReducer } from "./reducers/movieReducers";
import { movieDetailsReducer } from "./reducers/movieReducers";
import { userLoginReducer, userProfileReducer, userRegisterReducer } from "./reducers/userReducers";
import { watchHistoryReducer } from "./reducers/watchHistoryReducers";
import { bookmarkReducer } from "./reducers/bookmarkReducers";
import { subscriptionReducer } from "./reducers/subscriptionReducers";

const reducer = combineReducers({
    movieTopPicks: movieTopPicksReducer,
    movieRecentlyAdded: movieRecentlyAddedReducer,
    movieDetails: movieDetailsReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer,
    searchMovies: searchMoviesReducer,
    watchHistory: watchHistoryReducer,
    movieWatchHistory: movieWatchHistoryReducer,
    bookmarks: bookmarkReducer,
    subscription: subscriptionReducer,

})

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : '';

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
    subscription: { paymentMethod: paymentMethodFromStorage }
};

const store = configureStore({
    reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;