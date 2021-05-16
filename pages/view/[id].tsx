import style from './[id].module.scss';
import { WithTranslation } from "next-i18next";
import { withTranslation } from '../../i18n';
import Head from 'next/head';
import Map, { FloorNode, Node } from '../../components/kainplan/Map';
import { NextRouter, useRouter } from 'next/router';
import ResponsiveInputBox from '../../components/kainplan/ResponsiveInputBox';
import SearchBox from '../../components/kainplan/SearchBox';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

interface ViewProps extends WithTranslation {
};

const View = ({ t, }: ViewProps) => {
  const router: NextRouter = useRouter();
  const map: MutableRefObject<Map> = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  const onSearchType = (content: string) => {
    setSuggestions([]);
    if (content.length >= 3) setSuggestions(map.current.findEndpoints(content));
  };

  const onSelectStart = (floor: number, n: Node) => {
    
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
            westIcon={faBars} 
            eastIcon={faSearch} 
            label={[ 'Direktion', '4DHIF', ]}
            onContentChange={onSearchType}
          />
          <div>
            { suggestions instanceof Array
              ? (suggestions as FloorNode[]).map((n: FloorNode) => 
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