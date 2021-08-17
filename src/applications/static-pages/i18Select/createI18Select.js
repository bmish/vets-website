import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { buildLanguageListWithUrls } from './utilities/helpers';

export default function createI18Select(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // using data-translated-pages attr provided from graphql query
  // see content-build/src/site/layouts/page.drupal.liquid
  const pages = root?.dataset?.translatedPages
    ? JSON.parse(root.dataset.translatedPages)
    : [];

  const currentUrl = root?.dataset?.entityUrl;

  const languageList = buildLanguageListWithUrls(pages);

  // only render when more than just one language available for page
  if (languageList.length <= 1) return;

  if (root) {
    import(/* webpackChunkName: "i18Select" */
    './I18Select').then(module => {
      const I18Select = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <I18Select languageList={languageList} currentUrl={currentUrl} />
        </Provider>,
        root,
      );
    });
  }
}
