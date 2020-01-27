import React, { useState, useEffect } from 'react';
import { useInterval } from '@react-corekit/use-interval';

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
      <button
        type="button"
        onClick={() => {
          window.ipc.startSolidMessage('generate-keys');
        }}
      >
        Generate Keys
      </button>
      <div>{solidState}</div>
      {solidState === 'solid not running' && (
        <div>
          Click Button To Start SoLiD Server
          <br />
          <button
            type="button"
            onClick={() => {
              setSolidState('solid starting');
              window.ipc.startSolidMessage('solid-server');
            }}
          >
            Start SoLiD Server
          </button>
        </div>
      )}
    </div>
  );
}
