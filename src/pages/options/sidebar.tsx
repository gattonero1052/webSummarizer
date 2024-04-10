import { IconGithub, IconSetting, IconSummary, IconTasks } from '@root/src/shared/icon';
import './sidebar.scss';
import { useContext } from 'react';
import { MenuContext } from './dashboard';

const MenuItems = [
  {
    id: 'summary',
    Icon: IconSummary,
    title: 'Summary',
  },
  {
    id: 'settings',
    Icon: IconSetting,
    title: 'Settings',
  },
  {
    id: 'tasks',
    Icon: IconTasks,
    title: 'Tasks',
  },
];

export default function Sidebar() {
  const [selectedMenu, setMenu] = useContext(MenuContext);

  return (
    <div className="sidebar-wrapper">
      <div className="header">
        <span className="version">v0.01</span>
        <IconGithub />
      </div>
      <div className="body flex flex-col">
        {MenuItems.map(({ id, Icon, title }) => (
          <div
            key={id}
            className={`item-wrapper flex justify-start ${id === selectedMenu ? 'selected' : ''}`}
            onClick={() => {
              if (selectedMenu !== id) {
                setMenu(id);
              }
            }}>
            <div className="item flex gap-2 items-center">
              <Icon />
              <div>{title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
