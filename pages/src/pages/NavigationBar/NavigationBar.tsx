import React from 'react';
import {Nav} from 'react-bootstrap';
import './NavigationBar.css';

const NavigationBar: React.FC = () => {
  return (
    <div className="navigation-container">
      <img className="logo" alt="logo" src={require('./logo.png')} />
      <Nav activeKey="/home">
        {[
          {href: '/windborn/home', label: 'Home'},
          {href: '/windborn/privacy', label: 'Privacy'},
          {href: '/windborn/contact', label: 'Contact'},
        ].map(tab => (
          <Nav.Item className="navigation-items">
            <Nav.Link className="navigation-link" href={tab.href}>
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default NavigationBar;
