import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMovies } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MovieRow from '../components/MovieRow';

function HomeScreen() {
  const dispatch = useDispatch();
  const movieList = useSelector(state => state.movieList);
  const { error, loading, movies } = movieList;

  useEffect(() => {
    dispatch(listMovies());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <MovieRow title="Trending Now" movies={movies.slice(0, 6)} />
          <MovieRow title="Recently Added" movies={movies.slice(6, 12)} />
          <MovieRow title="Top Picks for You" movies={movies.slice(12, 18)} />
        </>
      )}
    </div>
  );
}

export default HomeScreen;
