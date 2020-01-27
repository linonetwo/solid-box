import React from 'react';
import { Switch, Route } from 'react-router';
import ROUTES from '../constants/routes.json';
import Settings from '../pages/settings/Settings';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.SETTINGS} component={Settings} />
      </Switch>
    );
  }
}

export default Routes;
