import React from 'react';

import Mkcert from '../../components/handlers/Mkcert';
import Solid from '../../components/handlers/Solid';
import Hosts from '../../components/handlers/Hosts';

export default class Settings extends React.Component {
  render() {
    return (
      <div>
        <Mkcert />
        <span>----</span>
        <Solid />
        <span>----</span>
        <Hosts />
        <a href="https://localhost:50110">Click me to go to the SoLiD Panel.</a>
      </div>
    );
  }
}
