import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import NavigationBar from './pages/NavigationBar/NavigationBar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <div className="page-wrapper">
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
