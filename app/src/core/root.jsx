import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import ThemeProvider from '@kiwicom/orbit-components/lib/ThemeProvider';
import Routes from './routes';
import GlobalStyle from './GlobalStyles';
import customTokens from './theme';

class Root extends React.Component<*> {
  render() {
    const { store, history } = this.props;

    return (
      <>
        <GlobalStyle />
        <ThemeProvider theme={{ orbit: customTokens }}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <Routes />
            </ConnectedRouter>
          </Provider>
        </ThemeProvider>
      </>
    );
  }
}

export default Root;
