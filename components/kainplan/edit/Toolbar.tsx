import style from './Toolbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEraser, faWrench, faPlus, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';

const Toolbar = () => (
    <div className={style.toolbar}>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faDotCircle} size='2x'/></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faCircle} size='2x'/></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faMapMarkerAlt} size='2x'/></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faEraser} size='2x'/></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faWrench} size='2x'/></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faPlus} size='2x'/></i>
        <br/>
    </div>
);

export default Toolbar;