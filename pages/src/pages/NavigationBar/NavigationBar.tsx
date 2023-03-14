import React from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import './NavigationBar.css';

const NavigationBar: React.FC = () => {
  return (
    <Navbar fixed="top" collapseOnSelect expand="sm" bg="black">
      <Container className="navigation-container">
        <Navbar.Brand href="#home">
          <img className="logo" alt="logo" src={require('./logo.png')} />
        </Navbar.Brand>

        <Navbar.Toggle
          className="navigation-collapsed-menu"
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {[
              {href: '/windborn/#Home', label: 'Home'},
              {href: '/windborn/#Privacy', label: 'Privacy'},
              {href: '/windborn/#Contact', label: 'Contact'},
            ].map(tab => (
              <Nav.Link className="navigation-link" href={tab.href}>
                {tab.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
