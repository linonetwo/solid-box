import React, { useState, useEffect } from 'react';

export default function StartSoLiD() {
  const [solidState, setSolidState] = useState('solid not running');
  useEffect(() => {
    const listener = (event, args) => {
      if (args === 'solid-started') {
        setSolidState('solid started');
      }
    };
    window.ipc.listenSolid(listener);
    return () => window.ipc.unListenSolid(listener);
  }, []);

  return (
    <div>
      <div>{solidState}</div>
      {solidState === 'solid not running' && (
        <div>
          Click Button To Start SoLiD Server
          <br />
          <button
            type="button"
            onClick={() => {
              setSolidState('solid starting');
              window.ipc.startSolidMessage();
            }}
          >
            Start SoLiD Server
          </button>
        </div>
      )}
    </div>
  );
}
