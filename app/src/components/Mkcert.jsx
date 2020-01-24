import React, { useState, useEffect } from "react";

export default function InstallMkcert(props) {
  const [mkcertState, setMkcertState] = useState("unchecked");
  useEffect(() => {
    // call api defined in app/electron/preload.js
    window.ipc.installPackageMessage("check-mkcert");
    console.log('aaa');
    
  }, []);
  useEffect(() => {
    const listener = (event, args) => {
      if (args === "mkcert-already-installed") {
        setMkcertState("mkcert already installed");
      } else if (args === "mkcert-not-installed") {
        setMkcertState("mkcert not installed");
      }
    };
    window.ipc.listenInstallPackage(listener);
    return () => window.ipc.unListenInstallPackage(listener);
  }, []);

  return (
    <div>
      {mkcertState}
      {mkcertState === "mkcert not installed" && (
        <div>
          Click Button To Install MKCERT
          <br />
          <button
            onClick={() => {
              window.ipc.installPackageMessage("install-mkcert");
            }}
          >
            Install MKCERT
          </button>
        </div>
      )}
    </div>
  );
}
