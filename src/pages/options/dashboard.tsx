import { useEffect, createContext, useState } from 'react';
import Sidebar from './sidebar';
import Summary from './summary';
import Settings from './settings';
import Tasks from './tasks';
const DefaultMenu = 'summary';
export const MenuContext = createContext([]);

export default function Dashboard() {
  const [menu, setMenu] = useState(DefaultMenu);

  useEffect(() => {
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
  }, []);
  return (
    <MenuContext.Provider value={[menu, setMenu]}>
      <Sidebar />
      {menu === 'summary' ? <Summary /> : null}
      {menu === 'settings' ? <Settings /> : null}
      {menu === 'tasks' ? <Tasks /> : null}
    </MenuContext.Provider>
  );
}
