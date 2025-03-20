import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../actions/movieActions';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const SearchResultsScreen = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const dispatch = useDispatch();
    const { movies } = useSelector((state) => state.searchMovies);

    useEffect(() => {
        if (query) {
            dispatch(searchMovies(query));
        }
    }, [dispatch, query]);

    return (
        <Container className="mt-4">
            <h1>Results for "{query}"</h1>
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
