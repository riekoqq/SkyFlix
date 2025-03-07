import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from 'redux-thunk';
import { movieListReducer } from "./reducers/moviesReducers";
import { movieDetailsReducer } from "./reducers/moviesReducers";

const reducer = combineReducers({
    movieList: movieListReducer,
    movieDetails: movieDetailsReducer,
})

const initialState = {

}

const middleware = [thunk]

const store = configureStore({
    reducer,
    initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
})

export default store