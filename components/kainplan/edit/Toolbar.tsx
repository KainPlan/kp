import style from './Toolbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEraser, faWrench, faPlus, faCircle, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { WithTranslation } from 'next-i18next';
import { withTranslation } from '../../../i18n';

interface ToolbarProps extends WithTranslation {
  doMove: ()=>void;
  placeNode: ()=>void;
  doConnect: ()=>void;
  doErase: ()=>void;
};

const Toolbar = ({ t, doMove, placeNode, doConnect, doErase, }: ToolbarProps) => (
  <div className={style.toolbar}>
    <i className={style.toolbarItem}>
      <FontAwesomeIcon icon={faArrowsAlt} onClick={doMove} />
    </i>
    <i title={t('edit:node')} className={style.toolbarItem} onClick={placeNode}>
      <FontAwesomeIcon icon={faCircle} />
    </i>
    <i title={t('edit:endpoint')} className={style.toolbarItem}>
      <FontAwesomeIcon icon={faMapMarkerAlt} />
    </i>
    <i title={t('edit:erase')} className={style.toolbarItem} onClick={doErase}>
      <FontAwesomeIcon icon={faEraser} />
    </i>
    <i title={t('edit:connection')} className={style.toolbarItem} onClick={doConnect}>
      <FontAwesomeIcon icon={faWrench} />
    </i>
    <i className={style.toolbarItem}>
      <FontAwesomeIcon icon={faPlus} />
    </i>
  </div>
);

Toolbar.getInitialProps = async () => ({
  namespacesRequired: ['common','edit',],
});

export default withTranslation()(Toolbar);