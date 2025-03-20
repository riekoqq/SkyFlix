import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../actions/movieActions';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const useQuery = () => {
    return new URLSearchParams(useLocation().search).get("q");
};

const SearchResultsScreen = () => {
    const query = useQuery();
    const dispatch = useDispatch();
    const { movies } = useSelector((state) => state.searchMovies);
    const [searchSubmitted, setSearchSubmitted] = useState(false);

    useEffect(() => {
        if (query) {
            dispatch(searchMovies(query));
            setSearchSubmitted(true);
        }
    }, [query, dispatch]);

    return (
        <Container className="mt-4">
            <h1 style={{ color: 'white' }}>Results for "{query || '...'}"</h1>

            {searchSubmitted && movies.length === 0 && (
                <Alert variant="danger">No movies found for "{query}". Try another search.</Alert>
            )}

            <Row>
                {movies.map((movie) => (
                    <Col key={movie.id} md={3} className="mb-4">
                        {/* Make the movie card clickable */}
                        <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card className="h-100">
                                <Card.Img variant="top" src={movie.image} alt={movie.title} />
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SearchResultsScreen;
