import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logWatchHistory } from '../actions/watchHistoryActions';
import Movie from './Movie';
import '../components_css/MovieRow.css';

function MovieRow({ title, movies }) {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.userLogin?.userInfo);

    const handleWatch = (movieId) => {
        console.log("Logging movie watch history for:", movieId); // Debugging
        if (userInfo) {
            dispatch(logWatchHistory(movieId));
        } else {
            console.warn("User not logged in!");
        }
    };

    return (
        <div className="movie-row">
            <h4 className="row-title">{title}</h4>
            <div className="movies-container">
                {movies.map(movie => (
                    <div key={movie._id} onClick={() => handleWatch(movie._id)}>
                        <Movie movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieRow;
