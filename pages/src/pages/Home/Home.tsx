import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import './Home.css';
import HomeButton from './HomeButton';
import playImage from './play.png';
import githubImage from './github.png';

const Home: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div id="Home" data-scroll-section className="home-content">
      <div>
        <div className="home-header">
          Copy images to your clipboard from Reddit posts
        </div>
        <HomeButton
          source={playImage}
          href="https://play.google.com/store/apps/details?id=com.windborn">
          Get now
        </HomeButton>
        <HomeButton onClick={() => setShow(true)}>Watch Demo</HomeButton>
        <HomeButton
          source={githubImage}
          href="https://github.com/silvabacc/windborn">
          GitHub Link
        </HomeButton>
      </div>
      <img className="home-image" src={require('./man.png')} />
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <video
            className="home-player"
            autoPlay
            src="https://i.imgur.com/bS7Iw3v.mp4"
            loop
            controls
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
