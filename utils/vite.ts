import { type PluginOption } from 'vite';
import makeManifest from './plugins/make-manifest';
import customDynamicImport from './plugins/custom-dynamic-import';
import addHmr from './plugins/add-hmr';
import watchRebuild from './plugins/watch-rebuild';
import inlineVitePreloadScript from './plugins/inline-vite-preload-script';

export const getPlugins = (isDev: boolean): PluginOption[] => [
  makeManifest({ getCacheInvalidationKey }),
  customDynamicImport(),
  // You can toggle enable HMR in background script or view
  addHmr({ background: true, view: true, isDev }),
  isDev && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  // For fix issue#177 (https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177)
  inlineVitePreloadScript(),
];

const cacheInvalidationKeyRef = { current: generateKey() };

// content_script injected style is could cause CSS version skew in injected UI and page UI

// here content_script injected style is meant to be applied to the whole extension
// we remove the key (can't get it when we inject the style dynamically in content script)
// and EACH TIME WE DO MAJOR CHANGE TO THE STYLE, WE CHANGE THE KEY HERE AND also in root.tsx
// to invalidate the cache
export function getCacheInvalidationKey() {
  return '';
  // return cacheInvalidationKeyRef.current;
}

function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey(): string {
  return `${Date.now().toFixed()}`;
}
