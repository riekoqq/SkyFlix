import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../actions/movieActions';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, ListGroup } from 'react-bootstrap';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false); // ✅ New state to control dropdown visibility
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { movies } = useSelector((state) => state.searchMovies);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            dispatch(searchMovies(value));
            setShowDropdown(true); // ✅ Show dropdown when typing
        } else {
            setShowDropdown(false); // ✅ Hide dropdown if input is cleared
        }
    };

    const handleSelect = (title) => {
        setQuery(title);
        setShowDropdown(false); // ✅ Hide dropdown after selecting a movie
        navigate(`/search-results?q=${title}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            setShowDropdown(false); // ✅ Hide dropdown when submitting search
            navigate(`/search-results?q=${query}`);
        }
    };

    return (
        <div className="position-relative">
            <Form onSubmit={handleSubmit} className="d-flex">
                <FormControl
                    type="search"
                    placeholder="Search movies..."
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setShowDropdown(movies.length > 0)} // ✅ Show dropdown when input is focused
                    className="me-2"
                    aria-label="Search"
                />
            </Form>

            {/* Dropdown for search suggestions */}
            {showDropdown && movies.length > 0 && (
                <ListGroup className="position-absolute w-100 bg-white border shadow mt-1">
                    {movies.map((movie) => (
                        <ListGroup.Item
                            key={movie.id}
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() => handleSelect(movie.title)}
                        >
                            {movie.image && (
                                <img src={movie.image} alt={movie.title} className="me-2" width="30" height="30" />
                            )}
                            {movie.title}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default SearchBar;
