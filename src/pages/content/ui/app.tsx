import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import '../../../assets/font/LTInstitute-1.otf';
import { Login } from './login';
import { Summary } from './summary';

const defaultUser = {};

// -- ui component --
export default function App() {
  const [isAllHidden, toggleAllHidden] = useCycle(false, true);
  const [isSummaryOpen, toggleSummaryOpen] = useCycle(false, true);
  const [isLoginOpen, toggleLoginOpen] = useCycle(false, true);
  const isDragging = useRef(false);

  const floatButtonRef = useRef(null);
  const floatButtonYRef = useRef(0);
  const [floatButtonY, setFloatButtonY] = useState(0); // we need this one cause we have to trigger rerender
  const [user, setUser] = useState<any>(defaultUser);

  const setFloatButtonYRef = useCallback(() => {
    if (floatButtonRef.current) {
      floatButtonYRef.current = floatButtonRef.current!.getBoundingClientRect().y - 5;
    }
  }, [floatButtonRef.current]);

  // -- on page load scripts --
  useEffect(() => {
    // -- injected font --
    // tricky way to inject a font into page by content script
    // should add to content_scripts permission, need to use extension id
    // must be injected into <head>, would only be downloaded on using
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @font-face {
        font-family: LTInstitute;
        font-style: normal;
        font-weight: 400;
        src: url(chrome-extension://${chrome.runtime.id}/assets/otf/LTInstitute-1.chunk.otf) format('truetype');
      }
    `;
    document.head.appendChild(styleElement);

    // set user if we have unexpired user info
    (async () => {
      const data: any = await chrome.storage.local.get('user');
      const storedUser = data.user;
      if (storedUser?.expireTs && storedUser?.expireTs > new Date().getTime()) {
        setUser(storedUser);
      } else {
        chrome.storage.local.clear();
      }
    })();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        // on login success, we set the user info need for frontend and switch to summary
        if (newValue && key === 'jwt') {
          const { accessToken, payload } = JSON.parse(newValue);
          const { displayName, authType, verified } = payload;
          const loggedUser = {
            accessToken,
            displayName,
            authType,
            verified,
            // there isn't a field called "expired ts" in payload
            // we calculate this by simply adding a period of time to current ts
            expireTs: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
          };
          chrome.storage.local.set({
            user: loggedUser,
          });
          setUser(loggedUser);
          toggleLoginOpen();
          toggleSummaryOpen();
        }
      }
    });
    chrome.runtime.onMessage.addListener(message => {
      const { request, data } = message;
    });
  }, [setUser]);

  return (
    <>
      <motion.div style={{ display: isAllHidden ? 'none' : 'block' }}>
        <button
          style={{ position: 'absolute', right: 30, bottom: 30 }}
          onClick={() => {
            chrome.storage.local.clear();
          }}>
          clear chrome extension local storage
        </button>
        <Login
          isLoginOpen={isLoginOpen}
          onClose={() => toggleLoginOpen()}
          onSuccess={() => {
            toggleLoginOpen();
          }}
          yPos={floatButtonY}
        />
        <Summary
          isSummaryOpen={isSummaryOpen}
          toggleAllHidden={toggleAllHidden}
          onClose={() => toggleSummaryOpen()}
          yPos={floatButtonY}
        />
        <motion.div
          ref={ref => {
            floatButtonRef.current = ref;
            setFloatButtonYRef();
          }}
          className={`float-button`}
          whileTap={{ scale: 0.8 }}
          style={{ display: isLoginOpen || isSummaryOpen ? 'none' : 'flex' }}
          drag={'y'}
          dragConstraints={{ top: -100, bottom: 100 }}
          onDragStart={(event, { point }) => {
            isDragging.current = true;
          }}
          onDragEnd={(event, { point }) => {
            isDragging.current = false;
          }}
          onClick={() => {
            setFloatButtonYRef();
            if (!isDragging.current) {
              setFloatButtonY(floatButtonYRef.current);
              console.log('user when login', user);
              if (user && user.accessToken) {
                toggleSummaryOpen();
              } else {
                toggleLoginOpen();
              }
            }
          }}></motion.div>
      </motion.div>
    </>
  );
}
