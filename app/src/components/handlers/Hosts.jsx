import React from 'react';
import Button from '@kiwicom/orbit-components/lib/Button';
import Card, { CardSection } from '@kiwicom/orbit-components/lib/Card';

export default function StartSoLiD() {
  return (
    <Card title="Hosts" spaceAfter="normal" description="New subdomains need to be added to the /etc/hosts so it can be resolved. Every time after you registered a new WebID, please update the hosts.">
      <CardSection>
        <Button
          type="primary"
          onClick={() => {
            window.ipc.startSolidMessage('add-hosts');
          }}
        >
          Update Hosts
        </Button>
      </CardSection>
    </Card>
  );
}
