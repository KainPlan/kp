import style from './Toolbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEraser, faWrench, faPlus, faCircle, faArrowsAlt, IconDefinition, faExpandArrowsAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { WithTranslation } from 'next-i18next';
import { withTranslation } from '../../../i18n';

interface Tool {
  key: string;
  icon: IconDefinition;
  title?: string;
  callback?: ()=>void;
};

interface ToolbarProps extends WithTranslation {
  doPan: ()=>void;
  placeNode: ()=>void;
  placeEndpoint: ()=>void;
  doEdit: ()=>void;
  doMove: ()=>void;
  doErase: ()=>void;
  doConnect: ()=>void;
};

const Toolbar = ({ t, doPan, placeNode, placeEndpoint, doEdit, doMove, doErase, doConnect, }: ToolbarProps) => {
  const onClick = (e: React.MouseEvent, next?: ()=>void) => {
    console.log(e.target);
    if(next) next();
  };

  const tools: Tool[] = [
    { key: 'pan', icon: faArrowsAlt, title: t('edit:pan'), callback: doPan, },
    { key: 'node', icon: faCircle, title: t('edit:node'), callback: placeNode, },
    { key: 'endpoint', icon: faMapMarkerAlt, title: t('edit:endpoint'), callback: placeEndpoint, },
    { key: 'edit', icon: faPencilAlt, title: t('edit:edit'), callback: doEdit, },
    { key: 'move', icon: faExpandArrowsAlt, title: t('edit:move'), callback: doMove, },
    { key: 'erase', icon: faEraser, title: t('edit:erase'), callback: doErase, },
    { key: 'connect', icon: faWrench, title: t('edit:connection'), callback: doConnect, },
    // { key: 'idk', icon: faPlus, },
  ];

  return (
    <div className={style.toolbar}>
      {tools.map(tool => (
        <i key={tool.key} className={style.toolbarItem} onClick={e => onClick(e, tool.callback)} title={tool.title} >
          <FontAwesomeIcon icon={tool.icon} />
        </i>
      ))}
    </div>
  );
}

Toolbar.getInitialProps = async () => ({
  namespacesRequired: ['common','edit',],
});

export default withTranslation()(Toolbar);