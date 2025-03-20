import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../actions/movieActions';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const useQuery = () => {
    return new URLSearchParams(useLocation().search).get("q");
};

const SearchResultsScreen = () => {
    const query = useQuery(); // Get query from URL
    const dispatch = useDispatch();
    const { movies } = useSelector((state) => state.searchMovies);
    const [searchSubmitted, setSearchSubmitted] = useState(false); // Track search submission

    useEffect(() => {
        if (query) {
            dispatch(searchMovies(query));
            setSearchSubmitted(true); // Mark that a search was submitted
        }
    }, [query, dispatch]);

    return (
        <Container className="mt-4">
            <h1>Results for "{query || '...'}"</h1> 

            {/* Show error if search was submitted but no results found */}
            {searchSubmitted && movies.length === 0 && (
                <Alert variant="danger">No movies found for "{query}". Try another search.</Alert>
            )}

            <Row>
                {movies.map((movie) => (
                    <Col key={movie.id} md={3} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={movie.image} alt={movie.title} />
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SearchResultsScreen;
