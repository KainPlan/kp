import { withTranslation, Link } from '../../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../../models/User';
import { useRouter } from 'next/router';
import style from './[id].module.scss';
import Map from '../../components/kainplan/Map';
import Head from 'next/head';
import Toolbar from '../../components/kainplan/edit/Toolbar';
import Topbar from '../../components/kainplan/edit/Topbar';
import { useEffect } from 'react';

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
        <Toolbar />
        <div>
          <Map ref={e => map = e} id={router.query.id as string} mountCb={onresize}></Map>
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