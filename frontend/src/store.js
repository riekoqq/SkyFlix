import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from 'redux-thunk';
import { movieListReducer, searchMoviesReducer } from "./reducers/movieReducers";
import { movieDetailsReducer } from "./reducers/movieReducers";
import { userLoginReducer } from "./reducers/userReducers";

const reducer = combineReducers({
    movieList: movieListReducer,
    movieDetails: movieDetailsReducer,
    userLogin: userLoginReducer,
    searchMovies: searchMoviesReducer
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