import React, { useRef, useState, useEffect } from 'react';
import { withTranslation, Link } from '../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../models/User';
import style from './dashboard.module.scss';
import useUser from '../components/kainplan/auth/UserContext';
import Overview from '../components/kainplan/dashboard/Overview';
import Settings from '../components/kainplan/dashboard/Settings';
import Sidebar from '../components/kainplan/dashboard/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog } from '@fortawesome/free-solid-svg-icons';
import anime from 'animejs';

interface DashboardProps extends WithTranslation, WithUser {
};

const Dashboard = ({ t, }: DashboardProps) => {
  const { authenticated, user, loading, } = useUser();
  const [current, setCurrent] = useState(<></>);

  let content: HTMLDivElement = null;

  useEffect(() => {
    anime({
      targets: content,
      opacity: 1,
      easing: 'linear',
      duration: 150,
    });
  }, [current,]);

  const onComponentChange = (c: React.ReactElement) => {
    anime({
      targets: content,
      opacity: 0,
      easing: 'linear',
      duration: 100,
    }).finished.then(() => setCurrent(c));
  };

  return (
    <div className={style.root}>
      <div>
        <Link href="/">
          <img src={require('../images/lgb.png')} />
        </Link>
        <div>
          {
            !loading && authenticated
            ? <>
                <h4>{user!.username}</h4>
                <p>{user!.email}</p>
              </>
            : ''
          }
        </div>
      </div>
      <main>
        <Sidebar onComponentChange={onComponentChange} elements={[
          <>
            <i><FontAwesomeIcon icon={faHome} /></i>
            <span>Overview</span>
          </>,
          <>
            <i><FontAwesomeIcon icon={faCog} /></i>
            <span>Settings</span>
          </>,
        ]} components={[
          <Overview />,
          <Settings />,
        ]} />
        <div className={style.content} ref={e => content = e}>
          { current }
        </div>
        <span>{t('common:copyright')}</span>
      </main>
      <style jsx global>{`
        html, body, #__next {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          overflow-y: hidden;
        }
      `}</style>
    </div>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common','dashboard',],
});

export default withTranslation()(Dashboard);