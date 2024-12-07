import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Movie from '../components/Movie';
import movies from '../movies.js'

function HomeScreen() {
  return (
    <div>
        <h1 className="text-center py-3">Movies</h1>
        <Row>
            {movies.map(movies => (
                <Col key={[movies._id]} sm={12} md={6} lg={4} xl={3}>
                    <Movie movies={movies} />
                </Col>
            ))}
        </Row>
    </div>
  )
}

export default HomeScreen
