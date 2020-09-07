import style from './Tile.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TileProps {
  title: string;
  icon?: IconDefinition;
  children?: React.ReactElement|React.ReactElement[];
};

const Tile = ({ children, title, icon, }: TileProps) => {
  return (
    <div className={style.root}>
      <h3>
        {
          icon
          ? <i><FontAwesomeIcon icon={icon} /></i>
          : ''
        }
        {title}
      </h3>
      <div>
        {children}
      </div>
    </div>
  );
}

export default Tile;