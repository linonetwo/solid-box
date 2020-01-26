import React from 'react';
import { withTranslation } from 'react-i18next';

class Detail extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <webview id="solid" src="https://localhost:50110/" allowpopups />
        {t('found')}
        {t('pickle')}
      </div>
    );
  }
}

export default withTranslation()(Detail);
