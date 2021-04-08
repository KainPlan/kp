import { withTranslation, Link } from '../../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../../models/User';
import { useRouter } from 'next/router';
import style from './[id].module.scss';
import Map, { MapMode } from '../../components/kainplan/Map';
import Head from 'next/head';
import Toolbar from '../../components/kainplan/edit/Toolbar';
import Topbar from '../../components/kainplan/edit/Topbar';
import { useEffect } from 'react';
import PanTool from '../../components/kainplan/tools/PanTool';
import AddNodeTool from '../../components/kainplan/tools/AddNodeTool';
import AddEndpointTool from '../../components/kainplan/tools/AddEndpointTool';
import EraseNodeTool from '../../components/kainplan/tools/EraseNodeTool';
import ConnectNodesTool from '../../components/kainplan/tools/ConnectNodesTool';
import MoveNodeTool from '../../components/kainplan/tools/MoveNodeTool';
import EditEndpointTool from '../../components/kainplan/tools/EditEndpointTool';

interface EditProps extends WithTranslation, WithUser {
};

declare global {
  interface Window {
    map: Map;
  }
}

const Edit = ({ t, }: EditProps) => {
  const router = useRouter();
  var topbar: HTMLDivElement;
  var map: Map;

  const onresize = () => {
    map.resize(window.innerWidth, window.innerHeight-topbar.getBoundingClientRect().height);
  };

  useEffect(() => {
    window.addEventListener('resize', onresize);
    window.map = map;
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
        <Toolbar 
          doPan={() => map.changeTool(PanTool)} 
          placeNode={() => map.changeTool(AddNodeTool)} 
          placeEndpoint={() => map.changeTool(AddEndpointTool)}
          doEdit={() => map.changeTool(EditEndpointTool)}
          doMove={() => map.changeTool(MoveNodeTool)}
          doErase={() => map.changeTool(EraseNodeTool)}
          doConnect={() => map.changeTool(ConnectNodesTool)}
        />
        <div>
          <Map 
            ref={e => map = e} 
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