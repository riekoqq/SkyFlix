import React from 'react';
import Movie from './Movie';
import '../components_css/MovieRow.css';

function MovieRow({ title, movies }) {
    return (
        <div className="movie-row">
            <h4 className="row-title">{title}</h4>
            <div className="movies-container">
                {movies.map(movie => (
                    <Movie key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default MovieRow;
