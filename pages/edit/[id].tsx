import { withTranslation, Link } from '../../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../../models/User';
import { NextRouter, useRouter } from 'next/router';
import style from './[id].module.scss';
import Map, { MapMode } from '../../components/kainplan/Map';
import Head from 'next/head';
import Toolbar from '../../components/kainplan/edit/Toolbar';
import Topbar from '../../components/kainplan/edit/Topbar';
import { MutableRefObject, useEffect, useRef } from 'react';
import PanTool from '../../components/kainplan/tools/PanTool';
import AddNodeTool from '../../components/kainplan/tools/AddNodeTool';
import AddEndpointTool from '../../components/kainplan/tools/AddEndpointTool';
import EraseNodeTool from '../../components/kainplan/tools/EraseNodeTool';
import ConnectNodesTool from '../../components/kainplan/tools/ConnectNodesTool';
import MoveNodeTool from '../../components/kainplan/tools/MoveNodeTool';
import EditEndpointTool from '../../components/kainplan/tools/EditEndpointTool';
import AddFloor from '../../components/kainplan/prompts/AddFloor';
import Popup from '../../components/kainplan/Popup';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddStairsTool from '../../components/kainplan/tools/AddStairsTool';

interface EditProps extends WithTranslation, WithUser {
};

declare global {
  interface Window {
    map: Map;
  }
}

const Edit = ({ t, }: EditProps) => {
  const router: NextRouter = useRouter();
  var topbar: HTMLDivElement;
  let map: MutableRefObject<Map> = useRef<Map>(null);
  let addFloorPopup: MutableRefObject<Popup> = useRef<Popup>(null);

  const onresize = () => {
    map.current.resize(window.innerWidth, window.innerHeight-topbar.getBoundingClientRect().height);
  };
  
  const addFloor = () => {
    addFloorPopup.current.show();
  };

  useEffect(() => {
    window.addEventListener('resize', onresize);
    window.map = map.current;
  });

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
        <title>KainPlan ; Editor</title>
      </Head>
      <div className={style.root}>
        <Topbar ref={e => topbar = e} />
        <Popup ref={e => addFloorPopup.current = e} title={t('dashboard_maps:create_map')} icon={faPlus}>
          <AddFloor map={map} popup={addFloorPopup} />
        </Popup>
        <Toolbar 
          doPan={() => map.current.changeTool(PanTool)} 
          placeNode={() => map.current.changeTool(AddNodeTool)} 
          placeEndpoint={() => map.current.changeTool(AddEndpointTool)}
          doEdit={() => map.current.changeTool(EditEndpointTool)}
          doMove={() => map.current.changeTool(MoveNodeTool)}
          doErase={() => map.current.changeTool(EraseNodeTool)}
          doConnect={() => map.current.changeTool(ConnectNodesTool)}
          onAddFloor={addFloor}
          doAddStairs={() => map.current.changeTool(AddStairsTool)}
        />
        <div>
          <Map 
            ref={e => map.current = e} 
            id={router.query.id as string} 
            mountCb={onresize}
            tools={[
              PanTool,
              AddNodeTool,
              AddEndpointTool,
              MoveNodeTool,
              EditEndpointTool,
              EraseNodeTool,
              ConnectNodesTool,
              AddStairsTool,
            ]}
            ctrlTool={PanTool}
          ></Map>
        </div>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </>
  );
};

Edit.getInitialProps = async () => ({
  namespacesRequired: ['common','edit',],
});

export default withTranslation()(Edit);