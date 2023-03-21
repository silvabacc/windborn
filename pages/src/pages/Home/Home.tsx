import React, {useEffect, useState} from 'react';
import {Button, Modal, Collapse} from 'react-bootstrap';
import './Home.css';
import HomeButton from './HomeButton';
import playImage from './images/play.png';
import githubImage from './github.png';
import Carousel from 'react-bootstrap/Carousel';
import {useMediaQuery} from '@material-ui/core';

const Home: React.FC = () => {
  const [show, setShow] = useState(false);
  const [isCollapsd, setIsCollapsed] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  return (
    <div id="Home" data-scroll-section className="home-content">
      <h1>Copy images to your clipboard from Reddit posts</h1>
      {!isSmallScreen && (
        <img className="home-image" src={require('./images/banner.png')} />
      )}

      <Collapse in={isCollapsd}>
        <div className="home-slide-container">
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('./images/1.png')}
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('./images/2.png')}
                alt="Third slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('./images/3.png')}
                alt="Third slide"
              />
            </Carousel.Item>
          </Carousel>
        </div>
      </Collapse>

      <div className="home-buttons-container">
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
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-text">Copying</div>
          <video
            className="home-player"
            autoPlay
            src="https://i.imgur.com/biXLEBs.mp4"
            loop
            controls
          />
          <div className="modal-text">Sharing</div>
          <video
            className="home-player"
            src="https://i.imgur.com/MJqpE12.mp4"
            loop
            controls
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
