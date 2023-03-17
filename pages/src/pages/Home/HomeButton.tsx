import React from 'react';
import {Button} from 'react-bootstrap';

//When passing source, make sure you pass it as an import and not as a string variable
//Require only takes in string literals, and not variables
interface HomeButtonProps {
  source?: string;
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  source,
  href,
  children,
  onClick,
}) => {
  return (
    <Button
      className="home-buttons"
      variant="dark"
      href={href}
      target="_blank"
      onClick={() => (onClick ? onClick() : undefined)}>
      {source && <img src={source} className="home-icon" />}
      {children}
    </Button>
  );
};

export default HomeButton;
