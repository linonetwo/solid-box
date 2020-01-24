import React, { useState, useEffect } from "react";
import ROUTES from "Constants/routes";
import { Link } from "react-router-dom";

import Mkcert from "../../components/Mkcert";

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <Mkcert />
        <Link to={ROUTES.MAIN}>Click me to go to the main page.</Link>
      </div>
    );
  }
}

export default Welcome;
