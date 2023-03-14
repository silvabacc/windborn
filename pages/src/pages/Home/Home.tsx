import React from 'react';
import {Button} from 'react-bootstrap';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div id="Home" data-scroll-section className="home-content">
      <div>
        <div className="home-header">
          Copy images to your clipboard from Reddit posts
        </div>
        <Button className="home-buttons" variant="dark">
          Get now
        </Button>
        <Button className="home-buttons" variant="dark">
          Watch Demo
        </Button>
      </div>
      <img className="home-image" src={require('./man.png')} />
    </div>
  );
};

export default Home;
