import React, { useState, useEffect } from 'react';
import { useInterval } from '@react-corekit/use-interval';
import Button from '@kiwicom/orbit-components/lib/Button';
import Card, { CardSection } from '@kiwicom/orbit-components/lib/Card';

import { solidHost } from '../../constants/solid';

export default function StartSoLiD() {
  const [solidState, setSolidState] = useState('solid not running');
  useEffect(() => {
    const listener = (event, args) => {
      if (args === 'solid-started') {
        setSolidState('solid started');
      } else if (args === 'solid-not-started') {
        setSolidState('solid not running');
      } else if (args === 'no-key') {
        setSolidState('please generate keys first');
      }
    };
    window.ipc.listenSolid(listener);
    return () => window.ipc.unListenSolid(listener);
  }, []);

  useInterval(() => {
    window.ipc.startSolidMessage('check');
  }, 100);

  return (
    <Card header="SoLiD Server" spaceAfter="normal">
      <CardSection>
        <div>{solidState}</div>
      </CardSection>
      <CardSection>
        {solidState === 'solid not running' && (
          <Button
            type="primary"
            onClick={() => {
              setSolidState('solid starting');
              window.ipc.startSolidMessage('solid-server');
            }}
          >
            Start SoLiD Server
          </Button>
        )}
        {solidState === 'solid started' && (
          <a href={solidHost}>
            <Button type="primary">Open SoLiD Panel</Button>
          </a>
        )}
      </CardSection>
    </Card>
  );
}
