import React from 'react';
import styled from 'styled-components';

import Mkcert from '../../components/handlers/Mkcert';
import Solid from '../../components/handlers/Solid';
import Hosts from '../../components/handlers/Hosts';

const Container = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

export default class Settings extends React.Component {
  render() {
    return (
      <Container>
        <Mkcert />
        <Solid />
        <Hosts />
      </Container>
    );
  }
}
