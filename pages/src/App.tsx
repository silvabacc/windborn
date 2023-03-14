import NavigationBar from './pages/NavigationBar/NavigationBar';
import './App.css';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import {Container} from 'react-bootstrap';
import Home from './pages/Home/Home';
import {LocomotiveScrollProvider} from 'react-locomotive-scroll';
import {useRef} from 'react';

function App() {
  const containerRef = useRef(null);

  return (
    <Container className="page-wrapper">
      <LocomotiveScrollProvider
        options={{smooth: true}}
        containerRef={containerRef}>
        <main data-scroll-container ref={containerRef}>
          <NavigationBar />
          <div className="page-container">
            {[<Home />, <PrivacyPolicy />, <Contact />].map(component => (
              <div className="page-content">{component}</div>
            ))}
          </div>
        </main>
      </LocomotiveScrollProvider>
    </Container>
  );
}

export default App;
