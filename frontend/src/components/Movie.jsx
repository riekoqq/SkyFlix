import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Movie({ movie }) {
    return (
        <Card className="rounded border-0" style={{ width: '250px', marginRight: '10px' }}>
            <Link to={`/movies/${movie._id}`}>
                <Card.Img 
                    src={movie.image} 
                    className="img-fluid rounded" 
                    style={{ 
                        width: '100%', 
                        height: '140px', 
                        objectFit: 'contain', // Ensure full image is shown
                        backgroundColor: 'black' // Fill empty space
                    }} 
                />
            </Link>
        </Card>
    );
}

export default Movie;
