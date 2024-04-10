import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from '@pages/options/dashboard';
import '@pages/shared/style_out.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { NextUIProvider } from '@nextui-org/react';
import '../shared/global.scss';
import './index.scss';

refreshOnUpdate('pages/options');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <NextUIProvider>
      <Dashboard />
    </NextUIProvider>,
  );
}

init();
