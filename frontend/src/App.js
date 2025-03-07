import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieScreen from './screens/MovieScreen.jsx';
import MoviePlayer from './screens/MoviePlayer.jsx';

function App() {
  return (
    <Router>
      <Header />
      <div className="py-3" style={{ backgroundColor: 'black', color: 'white', height: '100vh' }}>
        <Container>
          <Routes>
            <Route path='/' element={ <HomeScreen />} exact />
            <Route path='/movies/:id' element={<MovieScreen />} />
            <Route path='/player/:id' element={<MoviePlayer />} />
          </Routes>
        </Container>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
