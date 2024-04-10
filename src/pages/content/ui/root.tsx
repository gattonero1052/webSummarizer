import { NextUIProvider } from '@nextui-org/system';
import { createRoot } from 'react-dom/client';
import App from '@pages/content/ui/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import globalStyle from '../../shared/global.scss?inline';
import appStyle from './app.scss?inline';
import bannerStyle from './banner.scss?inline';
import loadingStyle from './loading.scss?inline';
import loginStyle from './login.scss?inline';
import summaryStyle from './summay.scss?inline';

refreshOnUpdate('pages/content');

const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

/** Inject styles into shadow dom */
// cached tailwind basic style
const tailwindStyleLinkElement = document.createElement('link');
tailwindStyleLinkElement.setAttribute('rel', 'stylesheet');
tailwindStyleLinkElement.setAttribute(
  'href',
  `chrome-extension://${chrome.runtime.id}/assets/css/contentStyle.chunk.css`,
);
shadowRoot.appendChild(tailwindStyleLinkElement);

// inline component styles
[globalStyle, appStyle, bannerStyle, loadingStyle, summaryStyle, loginStyle].forEach(styleSource => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styleSource;
  shadowRoot.appendChild(styleElement);
  shadowRoot.appendChild(rootIntoShadow);
});

/**
 * https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
 * Please refer to the PR link above and go back to the contentStyle.css implementation, or raise a PR if you have a better way to improve it.
 */
createRoot(rootIntoShadow).render(
  <NextUIProvider>
    <main className="light text-foreground bg-background">
      <App />
    </main>
  </NextUIProvider>,
);
