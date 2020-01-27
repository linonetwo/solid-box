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
      </div>
    );
  }
}
