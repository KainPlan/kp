import style from './[id].module.scss';
import { WithTranslation } from "next-i18next";
import { withTranslation } from '../../i18n';
import Head from 'next/head';
import Map, { FloorNode, Node } from '../../components/kainplan/Map';
import { NextRouter, useRouter } from 'next/router';
import ResponsiveInputBox from '../../components/kainplan/ResponsiveInputBox';
import SearchBox from '../../components/kainplan/SearchBox';
import { faBars, faMapMarked, faMapMarkedAlt, faMapMarker, faMapMarkerAlt, faSearch, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';

interface ViewProps extends WithTranslation {
};

const View = ({ t, }: ViewProps) => {
  const router: NextRouter = useRouter();
  const map: MutableRefObject<Map> = useRef(null);
  
  const endSearch: MutableRefObject<SearchBox> = useRef(null);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const startSearch: MutableRefObject<SearchBox> = useRef(null);
  const [startSuggestions, setStartSuggestions] = useState([]);

  const onEndSearchType = (content: string) => {
    setEndSuggestions([]);
    map.current.unsetEnd();
    if (content.length >= 3) setEndSuggestions(map.current.findEndpoints(content, map.current.startNode ? [map.current.startNode,] : undefined));
  };

  const onSelectEnd = (floor: number, n: Node) => {
    map.current.setEnd(floor, n);
    console.log(`[DEBUG]: Set end = ${n.id} ... `);
    endSearch.current.input.input.value = n.body!.title;
    setEndSuggestions([]);
  };

  const onStartSearchType = (content: string) => {
    setStartSuggestions([]);
    map.current.unsetStart();
    if (content.length >= 3) setStartSuggestions(map.current.findEndpoints(content, map.current.endNode ? [map.current.endNode,] : undefined));
  };

  const onSelectStart = (floor: number, n: Node) => {
    map.current.setStart(floor, n);
    console.log(`[DEBUG]: Set start = ${n.id} ... `);
    startSearch.current.input.input.value = n.body!.title;
    setStartSuggestions([]);
  };

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
        <title>KainPlan ; Viewer</title>
      </Head>
      <div className={style.root}>
        <div className={style.nav}>
          <SearchBox 
            ref={e => endSearch.current = e}
            westIcon={faMapMarkerAlt}
            eastIcon={faSearch} 
            label={[ 'Direktion', '4DHIF', ]}
            onContentChange={onEndSearchType}
          />
          <div>
            { endSuggestions instanceof Array
              ? (endSuggestions as FloorNode[]).map((n: FloorNode) => 
                <div className={style.searchSugg} onClick={() => onSelectEnd(n.floor, n.node)}>
                  <h4>{n.node.body.title}</h4>
                  <p>{n.node.body.desc}</p>
                </div>)
              : <></>
            }
          </div>
          <SearchBox
            ref={e => startSearch.current = e}
            westIcon={faMapMarkedAlt}
            eastIcon={faSearch}
            label='Where are you?'
            onContentChange={onStartSearchType}
          />
          <div>
            { startSuggestions instanceof Array
              ? (startSuggestions as FloorNode[]).map((n: FloorNode) => 
                <div className={style.searchSugg} onClick={() => onSelectStart(n.floor, n.node)}>
                  <h4>{n.node.body.title}</h4>
                  <p>{n.node.body.desc}</p>
                </div>)
              : <></>
            }
          </div>
        </div>
        <Map
          ref={e => map.current = e}
          id={router.query.id as string}
          fullscreen
          viewMode
          />
      </div>
    </>
  );
};

View.getInitialProps = async () => ({
  namespacesRequired: ['common','edit',],
});

export default withTranslation()(View);