import React from 'react';
import { Card } from 'react-bootstrap';

function Movie({ movies }) {
    return (
        <div>
            <Card className="mx-3 my-3 p-5 rounded shadow">
                <a href={`/movies/${movies._id}`}>
                    <Card.Img src={movies.image} />
                </a>

                <Card.Body>
                    <a href={`/movies/${movies._id}`}>
                        <Card.Title>
                            <strong>{movies.title}</strong>
                        </Card.Title>
                    </a>
                    <p>{movies.description}</p>
                    <p>Genre: <strong>{movies.genre}</strong></p>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Movie;
