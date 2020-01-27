import React from 'react';
import Button from '@kiwicom/orbit-components/lib/Button';
import Card, { CardSection } from '@kiwicom/orbit-components/lib/Card';
import Heading from '@kiwicom/orbit-components/lib/Heading';

export default function StartSoLiD() {
  return (
    <Card header="Hosts" spaceAfter="normal">
      <CardSection>
        <Button
          type="primary"
          onClick={() => {
            window.ipc.startSolidMessage('add-hosts');
          }}
        >
          Add Hosts
        </Button>
      </CardSection>
    </Card>
  );
}
