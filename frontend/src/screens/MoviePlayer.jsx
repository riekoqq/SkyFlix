import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';

function MoviePlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/movies/${id}/`);
                setVideoUrl(response.data.video);
            } catch (err) {
                setError("Failed to load video.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    return (
        <div className="movie-player-container">
            <Button className="go-back" onClick={() => navigate(-1)}>
                ❌
            </Button>

            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="light" />
                    <p>Loading video...</p>
                </div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : videoUrl ? (
                <video
                    src={videoUrl}
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
