import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Movie({ movies }) {
    return (
        <div>
            <Card className="mx-3 my-1 p-4 rounded shadow">
                <Link to={`/movies/${movies._id}`}> {/* Corrected Link */}
                    <Card.Img src={movies.image} />
                </Link>

                <Card.Body>
                    <Link to={`/movies/${movies._id}`}> {/* Corrected Link */}
                        <Card.Title>
                            <strong className="text-dark">{movies.title}</strong>
                        </Card.Title>
                    </Link>
                    <p>{movies.description}</p>
                    <p>Genre: <strong>{movies.genre}</strong></p>
                    <p>Actors: <strong>{movies.actors}</strong></p>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Movie;
