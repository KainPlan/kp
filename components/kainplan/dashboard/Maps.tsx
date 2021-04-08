import style from './Maps.module.scss';
import Tile from './Tile';
import { faGlobeEurope, faChartArea, faExternalLinkAlt, faPlus, faPencilAlt, faPencilRuler, faPen } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { Link, withTranslation } from '../../../i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from '../Popup';
import CreateMap from '../prompts/CreateMap';
import { WithTranslation } from 'next-i18next';

interface MapsProps extends WithTranslation {
};

const Maps = ({ t, }: MapsProps) => {
  const [maps, setMaps] = useState([]);

  let createMapPopup: Popup;

  useEffect(() => {
    fetch('/api/maps')
      .then(res => {
        if (!res.ok) window.alert('error');
        return res.json();
      })
      .then(res => {
        if (!res.success) window.alert('error');
        setMaps(res.body);
      });
  }, []);

  const onCreateMap = ({}) => {
    createMapPopup.show();
  };

  return (
    <div className={style.root}>
      <div>
        <Tile title={t('dashboard_maps:stats')} icon={faChartArea}>
        </Tile>
      </div>
      <div>
        <div>
          <Tile title={t('dashboard_maps:my_maps')} icon={faGlobeEurope}>
            <table>
              <tr>
                <th>{t('dashboard_maps:m_name')}</th>
                <th>{t('dashboard_maps:m_desc')}</th>
                <th>{t('dashboard_maps:m_edit')}</th>
              </tr>
              {
                maps.length > 0
                  ? maps.map(m => <tr>
                      <td>{m.name}</td>
                      <td>{m.desc}</td>
                      <td>
                        <Link href={`/edit/${m._id}`}>
                          <a><FontAwesomeIcon icon={faPen} /></a>
                        </Link>
                      </td>
                    </tr>)
                  : ''
              }
            </table>
            <button onClick={onCreateMap}>
              <i><FontAwesomeIcon icon={faPlus} /></i> {t('dashboard_maps:m_add')}
            </button>
            <div className={style.createPopup}>
              <Popup ref={e => createMapPopup = e} title={t('dashboard_maps:create_map')} icon={faPlus}>
                <CreateMap />
              </Popup>
            </div>
          </Tile>
        </div>
        <div>
          <Tile title="...">
          </Tile>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Maps);