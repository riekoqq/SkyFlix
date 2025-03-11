import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';

function MoviePlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const movieDetails = useSelector((state) => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    useEffect(() => {
        dispatch({ type: 'MOVIE_DETAILS_RESET' }); // Clear previous movie data
        dispatch(listMovieDetails(id));
    }, [dispatch, id]);

    return (
        <div className="movie-player-container">
            <Button className="go-back" onClick={() => navigate(-1)}>❌</Button>

            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="light" />
                    <p>Loading video...</p>
                </div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : movie?.video ? (
                <video
                    src={movie.video}
                    controls
                    width="100%"
                    height="80vh"
                    autoPlay
                    preload="metadata"
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p className="no-video">🎬 No video available for this movie.</p>
            )}
        </div>
    );
}

export default MoviePlayer;
