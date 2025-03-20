import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTopPicks, listRecentlyAdded, listWatchHistory } from '../actions/movieActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MovieRow from '../components/MovieRow';
import { listBookmarks } from '../actions/bookmarkActions';

function HomeScreen() {
    const dispatch = useDispatch();

    const movieTopPicks = useSelector(state => state.movieTopPicks);
    const { error: errorTopPicks, loading: loadingTopPicks, movies: topPicks } = movieTopPicks;

    const movieRecentlyAdded = useSelector(state => state.movieRecentlyAdded);
    const { error: errorRecentlyAdded, loading: loadingRecentlyAdded, movies: recentlyAdded } = movieRecentlyAdded;

    const movieWatchHistory = useSelector(state => state.movieWatchHistory);
    const { error: errorWatchHistory, loading: loadingWatchHistory, movies: watchHistory } = movieWatchHistory;

    // ✅ Get bookmarks (watch later) from Redux
    const bookmarkState = useSelector(state => state.bookmarks);
    const { bookmarks } = bookmarkState;

    useEffect(() => {
        dispatch(listTopPicks());
        dispatch(listRecentlyAdded());
        dispatch(listWatchHistory());
        dispatch(listBookmarks());
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
                    {recentlyAdded?.movies?.length > 0 && (
                        <MovieRow title="Recently Added" movies={recentlyAdded.movies} />
                    )}

                    {topPicks?.length > 0 && (
                        <MovieRow title="Top Picks for You" movies={topPicks} />
                    )}

                    {watchHistory?.length > 0 && (
                        <MovieRow title="Watch Again" movies={watchHistory} />
                    )}

                    {/* ✅ Render Bookmarked Movies Row */}
                    {bookmarks?.length > 0 && (
                        <MovieRow 
                            title="Watch Later" 
                            movies={bookmarks
                                        .map(b => b.movie)
                                        .filter(movie => movie && movie._id)} 
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default HomeScreen;
