import React, { useState, useEffect } from 'react';
import Button from '@kiwicom/orbit-components/lib/Button';
import Card, { CardSection } from '@kiwicom/orbit-components/lib/Card';
import Text from '@kiwicom/orbit-components/lib/Text';

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
    <Card
      title="MKCERT"
      description="Mkcert is required to generate keys so our local https website can be trusted by your browser. Every time after you registered a new WebID, please regenerate the key."
      spaceAfter="normal"
    >
      <CardSection>
        <Text>{mkcertProgressState}</Text>
        <Text>{mkcertState}</Text>
      </CardSection>
      <CardSection>
        <Button
          disabled={mkcertState !== 'mkcert not installed'}
          type="primary"
          onClick={() => {
            setMkcertState('mkcert installing');
            window.ipc.installPackageMessage('install-mkcert');
          }}
        >
          Install MKCERT
        </Button>
      </CardSection>
      <CardSection>
        <Button
          type="primary"
          onClick={() => {
            window.ipc.startSolidMessage('generate-keys');
          }}
        >
          Generate Keys
        </Button>
      </CardSection>
    </Card>
  );
}
