import React from 'react';

export default function StartSoLiD() {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          window.ipc.startSolidMessage('add-hosts');
        }}
      >
        Add Hosts
      </button>
    </div>
  );
}
