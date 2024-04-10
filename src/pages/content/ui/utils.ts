export const Colors = {
  bg: '#eff0f3',
  stroke: '#0d0d0d',
  primary: '#ff8e3c',
  primaryText: '#0d0d0d',
  secondary: '#d9376e',
  secondaryText: '#0d0d0d',
  icon: '#2a2a2a',
  titleText: '#0d0d0d',
  contentText: '#2a2a2a',
};

export async function domCropImage({ dataUrl, x, y, w, h }) {
  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.src = dataUrl;
  });
}

export function extractMeaningfulStringFromHTML(htmlString: string) {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
}

function addCountMap(m, k) {
  m[k] = (m[k] || 0) + 1;
}

// extract page content based on url
// provide a default extractor
// uploading a dedicated extractor script by user is not possible
// because safety issues related (need to do tampermonkey things)
// see how things goes and do we really need to allow user uploaded script
// TODO
export function extractPage(document, lengthLimit = 500) {
  const elementsWithText = document.body.querySelectorAll(
    '*:not(script):not(style):not(iframe):not(frame):not(noscript):not(template)',
  );
  const countMap = {},
    textNodes = [];

  elementsWithText.forEach(function (element) {
    element.childNodes.forEach(function (node) {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = computedStyle.getPropertyValue('font-size');
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push({ node, fontSize });
      }
      addCountMap(countMap, fontSize.replace('px', ''));
    });
  });
  const countEntries = Object.entries(countMap).map(([k, v]) => [Number.parseFloat(k), v]);
  const reverseFreqCount = Object.entries(countEntries).sort(([k1, v1], [k2, v2]) => (v1 < v2 ? 1 : -1));
  const mostFrequentSize = reverseFreqCount[0][0];

  // here we suppose
  // 1. text with the most frequent text size are the main content
  // 2. text that with size larger than the text above and appear to be close to that text are titles
  let res = '';
  for (const textNode of textNodes) {
    const { node, fontSize } = textNode;
    const value = node.nodeValue.replace(/<!--.*?-->/g, '').trim();

    // ignore empty node and smaller text
    if (!value || fontSize < mostFrequentSize) return;

    // use line separator to indicate a title, use space to separate different text nodes
    const next = fontSize > mostFrequentSize ? '\n' + value + '\n' : value + ' ';

    if (res.length + next.length > lengthLimit) {
      // TODO frontend error msg
      break;
    } else {
      res += next;
    }
  }

  return res;
}

// https://www.geeksforgeeks.org/how-to-create-a-guid-uuid-in-javascript/
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// at least 8 characters, containing at least one uppercase letter, one lowercase letter, one number, and one special character
export function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#_@$!%*?&])[A-Za-z\d#_@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}
