import fs from 'node:fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: [
    'storage',
    'activeTab',
    'tabs',
    // 'sidePanel'
  ],
  // needed for screenshot
  host_permissions: ['<all_urls>'],
  // side_panel: {
  //   default_path: 'src/pages/sidepanel/index.html',
  // },
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html',
  // },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: [
        // 'http://*/*', 'https://*/*', '<all_urls>',
        'https://graphics.stanford.edu/*',
        // a dummy page backend returns for passing token
        'http://localhost:3000/*',
      ],
      js: ['src/pages/contentInjected/index.js'],
    },
    {
      matches: [
        // 'http://*/*', 'https://*/*', '<all_urls>',
        'https://graphics.stanford.edu/*',
      ],
      js: ['src/pages/contentUI/index.js'],
      // KEY for cache invalidation
      // css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  // devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/otf/*.otf', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
