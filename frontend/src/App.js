import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import { Container } from 'react-bootstrap';
import { Routes, Route, useLocation } from 'react-router-dom';
import MovieScreen from './screens/MovieScreen.jsx';
import MoviePlayer from './screens/MoviePlayer.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import SearchResultsScreen from './screens/SearchResultsScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import SubscriptionScreen from './screens/SubscriptionScreen.jsx';

function App() {
  const location = useLocation();  

  const hideNavbarOnPaths = ['/login', '/register'];
  const isMoviePlayerScreen = location.pathname.startsWith('/player/');

  return (
    <>
      {!hideNavbarOnPaths.includes(location.pathname) && !isMoviePlayerScreen && <Header />}

      <div className="py-3" style={{ backgroundColor: 'black', color: 'white', height: '100vh' }}>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/movies/:id' element={<MovieScreen />} />
            <Route path='/player/:id' element={<MoviePlayer />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path="/search-results" element={<SearchResultsScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/subscription' element={<SubscriptionScreen />} />
          </Routes>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default App;
