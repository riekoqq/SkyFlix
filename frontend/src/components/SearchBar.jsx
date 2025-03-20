import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies } from '../actions/movieActions';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, FormControl, ListGroup } from 'react-bootstrap';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    const { movies } = useSelector((state) => state.searchMovies);

    // Sync URL query with search input
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const queryParam = urlParams.get('q') || '';
        setQuery(queryParam);
    }, [location.search]);

    useEffect(() => {
        if (query.length > 1) {
            dispatch(searchMovies(query));
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [query, dispatch]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            navigate('/'); // Redirect to homepage if input is empty
        } else {
            navigate(`/search-results?q=${value}`, { replace: true });
        }
    };

    const handleSelect = (title) => {
        setQuery(title);
        setShowDropdown(false);
        navigate(`/search-results?q=${title}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDropdown(false);
        if (query.trim() === '') {
            navigate('/'); // Ensure homepage redirection on empty submit
        } else {
            navigate(`/search-results?q=${query}`);
        }
    };

    return (
        <div className="position-relative" ref={searchRef}>
            <Form onSubmit={handleSubmit} className="d-flex">
                <FormControl
                    type="search"
                    placeholder="Search movies..."
                    value={query}
                    onChange={handleChange}
                    className="me-2"
                    aria-label="Search"
                />
            </Form>

            {showDropdown && (
                <ListGroup className="position-absolute w-100 bg-white border shadow-lg mt-1" style={{ zIndex: 1050 }}>
                    {/* Show user input as first dropdown item */}
                    <ListGroup.Item onClick={() => handleSelect(query)}>
                        Search for "{query}"
                    </ListGroup.Item>

                    {/* Show movie results dynamically */}
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
