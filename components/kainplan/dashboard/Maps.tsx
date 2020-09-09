import style from './Maps.module.scss';
import Tile from './Tile';
import { faGlobeEurope, faChartArea, faExternalLinkAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { Link } from '../../../i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from '../Popup';

const Maps = ({}) => {
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
        <Tile title="Stats" icon={faChartArea}>
        </Tile>
      </div>
      <div>
        <div>
          <Tile title="My maps" icon={faGlobeEurope}>
            <table>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>View</th>
              </tr>
              {
                maps.length > 0
                  ? maps.map(m => <tr>
                      <td>{m.name}</td>
                      <td>{m.desc}</td>
                      <td>
                        <Link href={`/view/${m._id}`}>
                          <a><FontAwesomeIcon icon={faExternalLinkAlt} /></a>
                        </Link>
                      </td>
                    </tr>)
                  : ''
              }
            </table>
            <button onClick={onCreateMap}>
              <i><FontAwesomeIcon icon={faPlus} /></i> Add
            </button>
            <Popup ref={e => createMapPopup = e} title="Create map" icon={faPlus}>
              <h1>Hello World!</h1>
            </Popup>
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

export default Maps;