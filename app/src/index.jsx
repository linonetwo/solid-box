import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../localization/i18n.config';
import Root from './core/root';
import store, { history } from './redux/store/store';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Suspense fallback="loading">
      <Root store={store} history={history} />
    </Suspense>
  </I18nextProvider>,
  document.getElementById('target'),
);
