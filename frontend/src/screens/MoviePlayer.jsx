import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';

function MoviePlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [videoError, setVideoError] = useState(false); // Track video error

    const movieDetails = useSelector((state) => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    useEffect(() => {
        dispatch({ type: 'MOVIE_DETAILS_RESET' }); // Clear previous movie data
        dispatch(listMovieDetails(id));
    }, [dispatch, id]);

    // Handle Video Error
    const handleVideoError = () => {
        setVideoError(true);
    };

    return (
        <div className="movie-player-container">
            <Button className="go-back" onClick={() => navigate(-1)}>❌</Button>

            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="light" />
                    <p>Loading video...</p>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : movie?.video ? (
                <>
                    <video
                        src={movie.video}
                        controls
                        width="100%"
                        height="80vh"
                        autoPlay
                        preload="metadata"
                        onError={handleVideoError} // Handle broken video URLs
                    >
                        Your browser does not support the video tag.
                    </video>

                    {videoError && (
                        <Alert variant="danger" className="mt-3">
                            ❌ Error: This video is unavailable.
                        </Alert>
                    )}
                </>
            ) : (
                <Alert variant="warning">🎬 No video available for this movie.</Alert>
            )}
        </div>
    );
}

export default MoviePlayer;
