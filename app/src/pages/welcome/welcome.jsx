import React from "react";
import ROUTES from "Constants/routes";
import { Link } from "react-router-dom";

class Welcome extends React.Component {
  render() {
    return (
      <div>
        Click Button To Install MKCERT
        <br />
        <button
          onClick={() => {
            // call api defined in app/electron/preload.js
            window.ipc.installMkcert();
          }}
        >
          Install MKCERT
        </button>
        <Link to={ROUTES.MAIN}>Click me to go to the main page.</Link>
      </div>
    );
  }
}

export default Welcome;
