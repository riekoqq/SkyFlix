import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';
import { addBookmark, removeBookmark, listBookmarks } from '../actions/bookmarkActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { motion } from 'framer-motion';
import '../styles/MovieScreen.css';

function MovieScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const movieDetails = useSelector(state => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    const bookmarkState = useSelector(state => state.bookmarks);
    const { bookmarks } = bookmarkState;

    useEffect(() => {
        dispatch({ type: 'MOVIE_DETAILS_RESET' });
        dispatch(listMovieDetails(id));
        dispatch(listBookmarks());
    }, [dispatch, id]);

    // ✅ Always check dynamically
    const isBookmarked = bookmarks?.some(b => b.movie?._id === Number(id));

    const handleBookmarkToggle = () => {
        if (isBookmarked) {
            dispatch(removeBookmark(id)).then(() => dispatch(listBookmarks()));
        } else {
            dispatch(addBookmark(id)).then(() => dispatch(listBookmarks()));
        }
    };

    return (
        <motion.div
            className="movie-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : movie ? (
                <>
                    <Row className="justify-content-center text-white">
                        <Col md={6}>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Image 
                                    src={movie.image || '/placeholder-image.jpg'} 
                                    alt={movie.title} 
                                    fluid 
                                    className="rounded shadow-lg"
                                />
                            </motion.div>
                        </Col>
                        <Col md={4}>
                            <ListGroup variant="flush" className="bg-dark text-white p-3 rounded">
                                <ListGroup.Item className="bg-dark text-white">
                                    <h3 className="text-center">{movie.title}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-dark text-white">{movie.description}</ListGroup.Item>
                                <ListGroup.Item className="bg-dark text-white">🎭 Actors: {movie.actors}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={12} className="mt-4 text-center">
                            {userInfo?.role === 'premium' || userInfo?.role === 'admin' ? (
                                <motion.button 
                                    className="watch-now btn-lg mx-2" 
                                    disabled={!movie.video} 
                                    onClick={() => movie.video && navigate(`/player/${id}`, { state: { video: `${process.env.REACT_APP_API_URL}${movie.video}` } })}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    🎬 Watch Now
                                </motion.button>
                            ) : (
                                <Message variant="warning">🔒 This movie is available for Premium members only.</Message>
                            )}

                            {/* ✅ Animated Bookmark Button */}
                            <motion.button
                                className={`bookmark-btn mx-2 ${isBookmarked ? 'bookmarked' : ''}`}
                                onClick={handleBookmarkToggle}
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {isBookmarked ? '✅ Bookmarked' : '⭐ Bookmark'}
                            </motion.button>

                            <motion.button
                                className="go-back mx-2"
                                onClick={() => navigate('/')}
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                ❌
                            </motion.button>
                        </Col>
                    </Row>
                </>
            ) : (
                <p className="text-center text-white">No movie found.</p>
            )}
        </motion.div>
    );
}

export default MovieScreen;
