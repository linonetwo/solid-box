import React, { useState, useEffect } from 'react';
import ROUTES from 'Constants/routes';
import { Link } from 'react-router-dom';

import Mkcert from '../../components/Mkcert';
import Solid from '../../components/Solid';
import Hosts from '../../components/Hosts';

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <Mkcert />
        <span>----</span>
        <Solid />
        <span>----</span>
        <Hosts />
        <Link to={ROUTES.MAIN}>Click me to go to the main page.</Link>
      </div>
    );
  }
}

export default Welcome;
