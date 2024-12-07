import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

function App() {
  return (
    <div>
      <Header />
      <div>
        <HomeScreen />
      </div>
      <Footer />
    </div>
  );
}

export default App;
