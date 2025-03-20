import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTopPicks, listRecentlyAdded } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MovieRow from '../components/MovieRow';

function HomeScreen() {
  const dispatch = useDispatch();

  const movieTopPicks = useSelector(state => state.movieTopPicks);
  const { error: errorTopPicks, loading: loadingTopPicks, movies: topPicks } = movieTopPicks;

  const movieRecentlyAdded = useSelector(state => state.movieRecentlyAdded);
  const { error: errorRecentlyAdded, loading: loadingRecentlyAdded, movies: recentlyAdded } = movieRecentlyAdded;

  useEffect(() => {
    dispatch(listTopPicks());
    dispatch(listRecentlyAdded());
  }, [dispatch]);

  console.log("Redux Recently Added:", recentlyAdded);

  return (
    <div>
      {loadingTopPicks || loadingRecentlyAdded ? (
        <Loader />
      ) : errorTopPicks ? (
        <Message variant="danger">{errorTopPicks}</Message>
      ) : errorRecentlyAdded ? (
        <Message variant="danger">{errorRecentlyAdded}</Message>
      ) : (
        <>
          <MovieRow title="Recently Added" movies={recentlyAdded.movies || []} />
          <MovieRow title="Top Picks for You" movies={topPicks.movies || []} />
        </>
      )}
    </div>
  );
}

export default HomeScreen;
