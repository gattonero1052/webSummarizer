import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  console.log(message);
  const { request, data } = message;

  if (request === 'startScreenshot') {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
      const tab = tabs[0];
      const dataUrl = await chrome.tabs.captureVisibleTab();
      chrome.tabs.sendMessage(
        tab.id as number,
        {
          request,
          dataUrl,
          websiteUrl: tab.url,
        },
        response => {},
      );
    })();
  } else if (request === 'summary') {
    const { text, config, requestId } = message;

    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
      const tab = tabs[0];
      await fetch('http://localhost:3000/');
      chrome.tabs.sendMessage(
        tab.id as number,
        {
          name: 'summaryResult',
        },
        response => {},
      );
    })();
  } else if (request === 'ocrSumary') {
    // TODO send data url to ocr service, then send to LLM service to get text
    const { text, config, requestId } = message;
  }
});
