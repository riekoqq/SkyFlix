import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listMovieDetails } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for React Router v6+
import ReactPlayer from 'react-player';

function MovieScreen() {
    const { id } = useParams(); // Get movie ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook to get navigate function

    const movieDetails = useSelector(state => state.movieDetails);
    const { error, loading, movie } = movieDetails;

    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        dispatch(listMovieDetails(id)); // Fetch the movie using its ID
    }, [dispatch, id]);

    // Handle when the title or image is clicked to show the modal
    const handlePlayClick = () => {
        console.log('Title or image clicked');
        setShowModal(true); // Show modal when image/title is clicked
    };

    // Close the modal
    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : movie ? ( // Check if movie is not undefined
                <Row>
                    <Col md={6}>
                        {/* Make image clickable */}
                        <div
                            onClick={handlePlayClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <Image src={movie.image} alt={movie.title} fluid />
                        </div>
                        {/* Make title clickable */}

                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <div
                                onClick={handlePlayClick}
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline', // Optional, to make it more clickable visually
                                }}
                                >
                                    <h3>{movie.title}</h3> {/* Title is now clickable */}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>{movie.description}</ListGroup.Item>
                            <ListGroup.Item>
                                Actors: {movie.actors}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <div>
                        <button className="go-back" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>

                    {/* Movie Modal */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{movie.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ReactPlayer
                                url={movie.video_url} // Ensure this is the correct full URL to the video
                                playing={true} // Auto-play video
                                controls={true} // Show controls
                                width="100%" // Ensure full width
                                height="auto" // Auto height
                                onError={(e) => console.error('Error loading video:', e)} // Handle errors
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}  >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
            ) : (
                <p>No movie found.</p>
            )}
        </div>
    );
}

export default MovieScreen;
