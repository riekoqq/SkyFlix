import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function MovieScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const movieDetails = useSelector(state => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    useEffect(() => {
        dispatch({ type: 'MOVIE_DETAILS_RESET' }); // Clear previous movie data
        dispatch(listMovieDetails(id));
    }, [dispatch, id]);

    return (
        <div className="movie-container">
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : movie ? (
                <>
                    <Row className="justify-content-center text-white">
                        <Col md={6}>
                            <Image 
                                src={movie.image || '/placeholder-image.jpg'} 
                                alt={movie.title} 
                                fluid 
                                className="rounded shadow-lg"
                            />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant="flush" className="bg-dark text-white p-3 rounded">
                                <ListGroup.Item className="bg-dark text-white">
                                    <h3 className="text-center">{movie.title}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-dark text-white">{movie.description}</ListGroup.Item>
                                <ListGroup.Item className="bg-dark text-white">🎭 Actors: {movie.actors}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                            <Col md={12} className="mt-4 text-center">
                                {userInfo?.role === 'premium' || userInfo?.role === 'admin' ? (
                                    <Button 
                                        className="watch-now btn-lg mx-2" 
                                        disabled={!movie.video} 
                                        onClick={() => movie.video && navigate(`/player/${id}`, { state: { video: `${process.env.REACT_APP_API_URL}${movie.video}` } })}
                                    >
                                        🎬 Watch Now
                                    </Button>
                                ) : (
                                    <Message variant="warning">🔒 This movie is available for Premium members only.</Message>
                                )}
                                <Button className="go-back mx-2" onClick={() => navigate(-1)}>
                                    ❌
                                </Button>
                            </Col>
                    </Row>
                </>
            ) : (
                <p className="text-center text-white">No movie found.</p>
            )}
        </div>
    );
}

export default MovieScreen;
