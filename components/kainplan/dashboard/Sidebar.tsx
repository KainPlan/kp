import style from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

interface SidebarProps {
  elements: React.ReactElement[];
  components: React.ReactElement[];
  onComponentChange: (c: React.ReactElement) => void;
};

const Sidebar = ({ elements, components, onComponentChange, }: SidebarProps) => {
  const [wide, setWide] = useState(false);
  const [component, setComponent] = useState(0);

  useEffect(() => {
    onComponentChange(components[0]);
  }, []);

  const onToggle = () => {
    setWide(!wide);
  };

  const onSwitch = (i: number) => {
    if (i === component) return;
    onComponentChange(components[i]);
    setComponent(i);
  };

  return (
    <div className={style.root + ' ' + (wide ? style.wide : '')}>
      <span>
        <i><FontAwesomeIcon icon={faBars} onClick={onToggle} /></i>
      </span>
      <div>
        { elements.map((e, i) => (
            <div 
              className={ component === i ? style.active : '' } 
              onClick={() => onSwitch(i)}
            >{e}</div>
          )) }
      </div>
    </div>
  );
};

export default Sidebar;