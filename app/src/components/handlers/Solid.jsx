import React, { useState, useEffect } from 'react';
import { useInterval } from '@react-corekit/use-interval';
import Button from "@kiwicom/orbit-components/lib/Button"

import { solidHost } from '../../constants/solid';

export default function StartSoLiD() {
  const [solidState, setSolidState] = useState('solid not running');
  useEffect(() => {
    const listener = (event, args) => {
      if (args === 'solid-started') {
        setSolidState('solid started');
      } else if (args === 'solid-not-started') {
        setSolidState('solid not running');
      }
    };
    window.ipc.listenSolid(listener);
    return () => window.ipc.unListenSolid(listener);
  }, []);

  useInterval(() => {
    window.ipc.startSolidMessage('check');
  }, 100);

  return (
    <div>
      <Button
        type="button"
        onClick={() => {
          window.ipc.startSolidMessage('generate-keys');
        }}
      >
        Generate Keys
      </Button>
      <div>{solidState}</div>
      {solidState === 'solid not running' && (
        <div>
          Click Button To Start SoLiD Server
          <br />
          <Button
            type="button"
            onClick={() => {
              setSolidState('solid starting');
              window.ipc.startSolidMessage('solid-server');
            }}
          >
            Start SoLiD Server
          </Button>
        </div>
      )}
      {solidState === 'solid started' && (
        <div>
          <a href={solidHost}>Click me to go to the SoLiD Panel.</a>
        </div>
      )}
    </div>
  );
}
