import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useCycle,
  animate,
  useAnimate,
  stagger,
  AnimatePresence,
} from 'framer-motion';
import { Button } from '@nextui-org/button';
import { Slider } from '@nextui-org/slider';
import { Input, cn } from '@nextui-org/react';
import '../../../assets/font/LTInstitute-1.otf';
import {
  Colors,
  domCropImage,
  extractMeaningfulStringFromHTML,
  extractPage,
  uuidv4,
  validateEmail,
  validatePassword,
} from './utils';
import {
  IconEyeFilled,
  IconEyeSlashFilled,
  IconLoading,
  IconSelect,
  IconScreenshot,
  IconCollapse,
  IconExpand,
  IconGithub,
  IconGoogle,
  IconClose,
  IconSetting,
} from '../../../shared/icon';
import { Banner } from './banner';
import { Loading } from './loading';
import { useBanner, useRequestBackend } from './hooks';
import { Login } from './login';

// during mouse moving, only one target with this unique class would be marked
const UniqueClass = '_p_un1r_q_e__uf_e__l_x';

// -- removable handlers --
const inspectOnMouseOverHandler = function (event: any) {
  if (event.target.matches(':not(#chrome-extension-boilerplate-react-vite-content-view-root *)')) {
    event.target.classList.add(UniqueClass);
  }
};
const inspectOnMouseOutHandler = function (event: any) {
  if (event.target.matches(':not(#chrome-extension-boilerplate-react-vite-content-view-root *)')) {
    event.target.classList.remove(UniqueClass);
  }
};

// -- page level constants --
const SummaryLengthMarks = [
  {
    value: 20,
    label: '20%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 80,
    label: '80%',
  },
];

const Languages = [
  {
    value: 'enus',
    desc: 'English',
  },
  {
    value: 'zhcn',
    desc: '简体中文',
  },
];

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

export const Summary = ({ isSummaryOpen, toggleAllHidden, onClose, yPos = 0 }) => {
  const [optionExpanded, toggleOption] = useCycle(false, true);
  const menuBgRef = useRef(null);
  const screenshotRef = useRef({ state: 0, start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [summaryText, setSummaryText] = useState('');
  const [bannerRef, showMessage] = useBanner();
  const [isLoading, requestBackend] = useRequestBackend(() => {
    showMessage('Request time out');
  });
  const [scope, animate] = useAnimate();

  // -- page level functions --
  const onSelectElementToInspect = useCallback(
    event => {
      const text = inspectOnClickHandler(event);

      requestBackend(
        {
          request: 'summary',
          text: extractMeaningfulStringFromHTML(text),
          config: {},
        },
        message => {
          setSummaryText(message.data);
        },
      );

      toggleAllHidden();
    },
    [toggleAllHidden],
  );

  const inspectOnClickHandler = useCallback(
    function (event: any) {
      if (event.target.matches(`.${UniqueClass}`)) {
        event.target.classList.remove(UniqueClass);
        document.removeEventListener('mouseover', inspectOnMouseOverHandler);
        document.removeEventListener('mouseout', inspectOnMouseOutHandler);
        document.removeEventListener('click', inspectOnClickHandler);
        document.removeEventListener('contextmenu', inspectOnClickHandler);
        document.removeEventListener('click', onSelectElementToInspect);
        document.removeEventListener('contextmenu', onSelectElementToInspect);
        event.stopPropagation();
        event.preventDefault();
      }
      return extractMeaningfulStringFromHTML(event.target.innerHTML);
    },
    [onSelectElementToInspect, onSelectElementToInspect],
  );

  // inspect element to extract text
  const simulateInspect = useCallback(() => {
    toggleAllHidden();
    const styleElement = document.createElement('style');
    // TODO does not work for <small> or some other ones, is it a big problem?
    styleElement.innerHTML = `.${UniqueClass}{ backdrop-filter: invert(30%)!important;filter:invert(100%)!important; }`;
    document.head.appendChild(styleElement);

    document.addEventListener('mouseover', inspectOnMouseOverHandler);
    document.addEventListener('mouseout', inspectOnMouseOutHandler);
    document.addEventListener('click', onSelectElementToInspect);
    document.addEventListener('contextmenu', onSelectElementToInspect);
  }, [toggleAllHidden]);

  // take a screenshot of a specific area
  const simulateScreenshot = useCallback(() => {
    // create a canvas, listen to mouse down and mouse up
    // send coordinates to background sw and remove canvas
    toggleAllHidden();
    const canvas = document.createElement('canvas');
    const canvasBase = document.createElement('canvas');

    canvasBase.style.cssText = canvas.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      z-index:2147483647;`;
    canvasBase.width = canvas.width = window.innerWidth;
    canvasBase.height = canvas.height = window.innerHeight;
    canvasBase.style.zIndex = '2147483646';

    document.body.appendChild(canvas);
    document.body.appendChild(canvasBase);

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'xor';
    ctx.fillStyle = 'rgba(0,0,0,.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', (event: any) => {
      const button = event.button,
        state = screenshotRef.current.state,
        o = screenshotRef.current;
      // drawing
      if (state === 0) {
        if (button === 0) {
          o.state = 1;
          o.start.x = o.end.x = event.clientX;
          o.start.y = o.end.y = event.clientY;
        }
      }
      event.stopPropagation();
      event.preventDefault();
      return false;
    });

    const mousemoveHandler = (event: any) => {
      const state = screenshotRef.current.state,
        o = screenshotRef.current;
      if (state === 1) {
        o.end.x = event.clientX;
        o.end.y = event.clientY;

        const topLeftX = (Math.min(o.start.x, o.end.x) / canvas.width) * 100,
          bottomRightX = (Math.max(o.start.x, o.end.x) / canvas.width) * 100,
          topLeftY = (Math.min(o.start.y, o.end.y) / canvas.height) * 100,
          bottomRightY = (Math.max(o.start.y, o.end.y) / canvas.height) * 100;
        canvas.style.clipPath = `polygon(0% 0%, 0% 100%, ${topLeftX}% 100%,
            ${topLeftX}% ${topLeftY}%,
            ${bottomRightX}% ${topLeftY}%,
            ${bottomRightX}% ${bottomRightY}%,
            ${topLeftX}% ${bottomRightY}%,
            ${topLeftX}% 100%, 100% 100%, 100% 0%)`;
      }
      event.stopPropagation();
      event.preventDefault();
      return false;
    };

    canvas.addEventListener('mousemove', mousemoveHandler);
    canvasBase.addEventListener('mousemove', mousemoveHandler);

    canvas.addEventListener('contextmenu', (event: any) => {
      screenshotRef.current.state = 0;
      canvas.style.clipPath = '';
      event.stopPropagation();
      event.preventDefault();
      return false;
    });

    canvas.addEventListener('mouseup', (event: any) => {
      const button = event.button,
        state = screenshotRef.current.state,
        o = screenshotRef.current;
      // drawing
      if (state === 1) {
        o.state = 0;

        if (button === 0) {
          chrome.runtime.sendMessage({ request: 'startScreenshot' });
          document.body.removeChild(canvas);
          document.body.removeChild(canvasBase);
          toggleAllHidden();
        }
      }
    });
  }, [toggleAllHidden, screenshotRef]);

  const summaryPage = useCallback(() => {
    const extrated = extractPage(document);
    showMessage('request time out');
    // requestBackend({

    // });
  }, []);

  useEffect(() => {
    // -- listeners --
    chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
      // browser screenshot API listener, doesn't need a loading state
      if (message.request === 'startScreenshot') {
        if (!message.dataUrl) return;
        const o = screenshotRef.current;
        domCropImage({
          dataUrl: message.dataUrl,
          x: Math.min(o.start.x, o.end.x),
          y: Math.min(o.start.y, o.end.y),
          w: Math.abs(o.start.x - o.end.x),
          h: Math.abs(o.start.y - o.end.y),
        }).then(croppedImageUrl => {
          requestBackend({
            request: 'ocrSumary',
            dataUrl: croppedImageUrl,
          });
          // console.log(croppedImageUrl);
        });
      }
    });
  }, []);

  useEffect(() => {
    animate(
      menuBgRef.current,
      {
        clipPath: isSummaryOpen
          ? `circle(${window.screen.height}px at 0px ${yPos}px)`
          : `circle(60px at 0px ${yPos}px)`,
      },
      {
        type: 'decay',
        duration: 1.5,
      },
    );

    animate(
      `.menu-animation-item`,
      isSummaryOpen ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.3, filter: 'blur(20px)' },
      {
        duration: 0.2,
        delay: isSummaryOpen && optionExpanded ? staggerMenuItems : 0,
      },
    );
  }, [isSummaryOpen, yPos]);

  useEffect(() => {
    animate(`.menu-option-rows`, optionExpanded ? { height: 'auto' } : { height: 0 }, {
      duration: 0.2,
    });
  }, [optionExpanded, isSummaryOpen]);

  return (
    <motion.div ref={scope}>
      <AnimatePresence mode="popLayout">
        {isSummaryOpen ? (
          <motion.div
            className={`menu-wrapper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Banner ref={bannerRef} />
            <Loading isLoading={isLoading} />
            <motion.div
              className={`menu-bg`}
              ref={menuBgRef}
              style={{ display: !isSummaryOpen ? 'none' : 'flex' }}></motion.div>
            <div className={`menu-rows`}>
              <div className={`menu-buttons menu-animation-item`}>
                <div className={`menu-buttons-item cursor-pointer`} onClick={() => onClose()}>
                  <IconSetting width="30px" height="30px" fill={Colors.icon} />
                </div>
                <div className={`menu-buttons-item cursor-pointer`} onClick={() => onClose()}>
                  <IconClose width="30px" height="30px" fill={Colors.icon} />
                </div>
              </div>
            </div>
            <div className={`menu-rows menu-option-rows`}>
              <div className={`menu-operation menu-animation-item`}>
                <div className={`menu-operation-label`}>Choose from page</div>
                <div className={`menu-operation-button`}>
                  <Button
                    size="sm"
                    isIconOnly
                    color="primary"
                    onClick={() => simulateInspect()}
                    style={{ marginRight: '12px' }}>
                    <IconSelect />
                  </Button>

                  <Button size="sm" isIconOnly color="primary" onClick={() => simulateScreenshot()}>
                    <IconScreenshot />
                  </Button>
                </div>
              </div>
              {/* TODO auto scroll the page, and contact the ocr result together to do the summary */}
              {/* <div className={`menu-operation menu-animation-item`}>
        <div className={`menu-operation-label`}>
          Full page OCR
        </div>
        <div className={`menu-operation-button`}>
          <Switch aria-label="Full page OCR" classNames={{wrapper: cn('mr-0')}}></Switch>
        </div>
      </div> */}
              <div className={`menu-operation menu-animation-item`}>
                <Slider
                  label="Summary length"
                  color="foreground"
                  size="sm"
                  step={10}
                  marks={SummaryLengthMarks}
                  defaultValue={20}
                  minValue={10}
                  maxValue={100}
                  className="max-w-md"
                />
              </div>
              <div className={`menu-operation menu-animation-item`}>
                <div className={`menu-operation-label`}>Summary language</div>
                <div className={`menu-operation-button select-wrapper`}>
                  <select>
                    {Languages.map(({ value, desc }) => (
                      <option key={value} value={value}>
                        {desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="menu-rows">
              <div className={`menu-operation menu-animation-item`}>
                <Button
                  variant="ghost"
                  color="primary"
                  className="toggle-option-button"
                  onClick={() => toggleOption()}
                  endContent={
                    optionExpanded ? (
                      <IconCollapse style={{ marginBottom: '4px' }} />
                    ) : (
                      <IconExpand style={{ marginBottom: '4px' }} />
                    )
                  }>
                  {optionExpanded ? 'Hide' : 'Options'}
                </Button>
                <Button color="primary" variant="shadow" onClick={summaryPage}>
                  Summary
                </Button>
              </div>
            </div>
            <div className="menu-rows menu-row-summary">
              <div className="menu-summary-wrapper">
                <div className="menu-summary">{summaryText}</div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
