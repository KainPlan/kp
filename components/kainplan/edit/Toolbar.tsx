import style from './Toolbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEraser, faWrench, faPlus, faDotCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

const Toolbar = () => (
    <div className={style.toolbar}>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faDotCircle} /></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faCircle} /></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faMapMarkerAlt} /></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faEraser} /></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faWrench} /></i>
        <br/>
        <i className={style.toolbarItem}><FontAwesomeIcon icon={faPlus} /></i>
        <br/>
    </div>
);

export default Toolbar;