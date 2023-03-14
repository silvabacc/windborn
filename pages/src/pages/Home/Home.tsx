import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import ReactPlayer from 'react-player';
import './Home.css';

const Home: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div id="Home" data-scroll-section className="home-content">
      <div>
        <div className="home-header">
          Copy images to your clipboard from Reddit posts
        </div>
        <Button className="home-buttons" variant="dark">
          Get now
        </Button>
        <Button
          className="home-buttons"
          variant="dark"
          onClick={() => setShow(true)}>
          Watch Demo
        </Button>
        <Button
          className="home-buttons"
          variant="dark"
          href="https://github.com/silvabacc/windborn"
          target="_blank">
          <img src={require('./github.png')} className="home-icon" />
          GitHub Link
        </Button>
      </div>
      <img className="home-image" src={require('./man.png')} />
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <video
            className="home-player"
            autoPlay
            src="https://i.imgur.com/RdhpSAp.mp4"
            loop
            controls
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
