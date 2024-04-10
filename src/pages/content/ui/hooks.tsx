import { useState, useCallback, useRef } from 'react';
import { uuidv4 } from './utils';

export const useBanner = (): any => {
  const bannerRef = useRef(null);

  // TODO success msg, warning msg, normal msg
  const showMessage = useCallback(
    (msg, type = 'normal') => {
      bannerRef.current.show(msg);
    },
    [bannerRef.current],
  );
  return [bannerRef, showMessage];
};

export const useRequestBackend = (timeoutCallback?): any => {
  const [isLoading, setIsLoading] = useState(false);
  const blockLoadings = useRef([]);

  // send message to background js listener and set loading state
  return [
    isLoading,
    useCallback(
      (requestMessage, successCallback?: any, errorCallback?: any) => {
        const requestId = uuidv4();
        const { request } = requestMessage;
        setIsLoading(true);
        chrome.runtime.sendMessage({ ...requestMessage, requestId });
        blockLoadings.current = [...blockLoadings.current, requestId];
        setTimeout(() => {
          const index = blockLoadings.current.findIndex(v => v === requestId);
          if (index !== -1) {
            blockLoadings.current.splice(index, 1);
            if (!blockLoadings.current.length) {
              if (timeoutCallback) timeoutCallback();
              // showMessage('Request time out');
              setIsLoading(false);
            }
          }
        }, 2500);

        // TODO memory leak?
        chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
          if (message.request === request) {
            // TODO call callback by msg type
            if (successCallback) {
              successCallback(message);
            }

            if (errorCallback) {
              errorCallback(message);
            }
          }
        });
      },
      [setIsLoading, blockLoadings.current],
    ),
  ];
};
