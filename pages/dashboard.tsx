import React from 'react';
import { withTranslation, Link } from '../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../models/User';
import style from './dashboard.module.scss';
import useUser from '../components/kainplan/auth/UserContext';

interface DashboardProps extends WithTranslation, WithUser {
};

const Dashboard = ({ t, }: DashboardProps) => {
  const { authenticated, user, loading, } = useUser();

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
        <span>{t('common:copyright')}</span>
      </main>
      <style jsx global>{`
        html, body, #__next {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common','dashboard',],
});

export default withTranslation()(Dashboard);