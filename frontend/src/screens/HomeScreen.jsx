import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTopPicks, listRecentlyAdded, listWatchHistory } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MovieRow from '../components/MovieRow';

function HomeScreen() {
    const dispatch = useDispatch();

    const movieTopPicks = useSelector(state => state.movieTopPicks);
    const { error: errorTopPicks, loading: loadingTopPicks, movies: topPicks } = movieTopPicks;

    const movieRecentlyAdded = useSelector(state => state.movieRecentlyAdded);
    const { error: errorRecentlyAdded, loading: loadingRecentlyAdded, movies: recentlyAdded } = movieRecentlyAdded;

    const movieWatchHistory = useSelector(state => state.movieWatchHistory);
    const { error: errorWatchHistory, loading: loadingWatchHistory, movies: watchHistory } = movieWatchHistory;

    useEffect(() => {
        dispatch(listTopPicks());
        dispatch(listRecentlyAdded());
        dispatch(listWatchHistory());
    }, [dispatch]);

    return (
        <div>
            {(loadingTopPicks || loadingRecentlyAdded || loadingWatchHistory) ? (
                <Loader />
            ) : (errorTopPicks || errorRecentlyAdded || errorWatchHistory) ? (
                <Message variant="danger">
                    {errorTopPicks || errorRecentlyAdded || errorWatchHistory}
                </Message>
            ) : (
                <>
                    <MovieRow title="Recently Added" movies={recentlyAdded.movies || []} />
                    <MovieRow title="Top Picks for You" movies={topPicks || []} />
                    <MovieRow title="Watch Again" movies={watchHistory || []} />
                </>
            )}
        </div>
    );
}

export default HomeScreen;
