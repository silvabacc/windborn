import NavigationBar from './pages/NavigationBar/NavigationBar';
import './App.css';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import {Container} from 'react-bootstrap';

function App() {
  return (
    <Container className="page-wrapper">
      <NavigationBar />
      <Container className="page-container">
        {[<Home />, <PrivacyPolicy />, <Contact />].map(component => (
          <div className="page-content">{component}</div>
        ))}
      </Container>
    </Container>
  );
}

export default App;
