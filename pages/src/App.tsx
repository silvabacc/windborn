import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import NavigationBar from './pages/NavigationBar/NavigationBar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="page-wrapper">
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route path="/windborn">
            <Route path="home" element={<Home />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="contact" element={<Contact />} />
            <Route path="" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
