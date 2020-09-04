import React from 'react';
import { withTranslation } from '../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../models/User';
import style from './dashboard.module.scss';
import useUser from '../components/kainplan/auth/UserContext';

interface DashboardProps extends WithTranslation, WithUser {
};

const Dashboard = ({}: DashboardProps) => {
  const { authenticated, user, loading, } = useUser();

  return (
    <div className={style.root}>
      {
        loading
        ? <h1>Loading ... </h1>
        : <>
            <h1>Welcome back <u>{user.username}</u>!</h1>
            <h3>({user.email})</h3>
          </>
      }
      <style jsx global>{`
        html, body, #__next {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common','dashboard',],
});

export default withTranslation()(Dashboard);