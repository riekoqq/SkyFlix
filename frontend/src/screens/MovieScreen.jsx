import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';

function MovieScreen() {
    const { id } = useParams(); // Get movie ID from URL
    const dispatch = useDispatch();

    const movieDetails = useSelector(state => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    useEffect(() => {
        dispatch(listMovieDetails(id)); // Fetch the movie using its ID
    }, [dispatch, id]);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : movie ? ( // Check if movie is not undefined
                <Row>
                    <Col md={6}>
                        <Image src={movie.image} alt={movie.title} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{movie.title}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>{movie.description}</ListGroup.Item>
                            <ListGroup.Item>
                                Actors: {movie.actors}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Link to="/"> 
                        <button class="go-back" onclick="history.back()">Go Back</button>
                    </Link>
                </Row>
            ) : (
                <p>No movie found.</p>
            )}
        </div>
    );
}

export default MovieScreen;
