import React, { useState, useEffect } from 'react';

export default function InstallMkcert() {
  const [mkcertState, setMkcertState] = useState('unchecked');
  const [mkcertProgressState, setMkcertProgressState] = useState('');
  useEffect(() => {
    // call api defined in app/electron/preload.js
    window.ipc.installPackageMessage('check-mkcert');
    console.log('aaa');
  }, []);
  useEffect(() => {
    if (
      mkcertState === 'mkcert not installed' ||
      mkcertState === 'mkcert installing'
    ) {
      const listener = (event, args) => {
        setMkcertProgressState(`${mkcertProgressState}\n${args}`);
      };
      window.ipc.listenInstallPackageProgress(listener);
      return () => window.ipc.unListenInstallPackageProgress(listener);
    }
  }, [mkcertProgressState, mkcertState]);
  useEffect(() => {
    const listener = (event, args) => {
      if (args === 'mkcert-already-installed') {
        setMkcertState('mkcert already installed');
      } else if (args === 'mkcert-not-installed') {
        setMkcertState('mkcert not installed');
      } else if (args === 'mkcert-installed') {
        setMkcertState('mkcert installed');
      } else if (args === 'mkcert-install-failed') {
        setMkcertState('mkcert install failed');
      }
    };
    window.ipc.listenInstallPackage(listener);
    return () => window.ipc.unListenInstallPackage(listener);
  }, []);

  return (
    <div>
      <div>{mkcertState}</div>
      <div>{mkcertProgressState}</div>
      {mkcertState === 'mkcert not installed' && (
        <div>
          Click Button To Install MKCERT
          <br />
          <button
            type="button"
            onClick={() => {
              setMkcertState('mkcert installing');
              window.ipc.installPackageMessage('install-mkcert');
            }}
          >
            Install MKCERT
          </button>
        </div>
      )}
    </div>
  );
}
