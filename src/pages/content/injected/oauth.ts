import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/toggleTheme');

const attrName = 'jwt';
const checkAttr = async () => {
  const jwt = document.body.getAttribute(attrName);
  if (jwt) {
    chrome.storage.local.set({
      jwt,
    });
    window.close();
    return true;
  }
  return false;
};

if (!checkAttr()) {
  const observer = new MutationObserver(function (mutationsList, observer) {
    // Iterate over the list of mutations
    for (const mutation of mutationsList) {
      // Check if attributes were changed
      if (mutation.type === 'attributes' && mutation.attributeName === attrName) {
        checkAttr();
      }
    }
  });

  observer.observe(document.body, { attributes: true });
}
