import React, {useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import Movie from '../components/Movie';
import { useDispatch, useSelector } from 'react-redux';
import { listMovies } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomeScreen() {
  const dispatch = useDispatch()
  const movieList = useSelector(state => state.movieList)
  const {error, loading, movies} = movieList
  useEffect(() => {
    dispatch(listMovies())
  }, [])
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
            {movies.map(movies => (
                <Col key={[movies._id]} sm={12} md={6} lg={4} xl={3}>
                    <Movie movies={movies} />
                </Col>
            ))}
        </Row>
      )}
    </div>
  )
}

export default HomeScreen
