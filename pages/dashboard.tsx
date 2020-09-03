import React from 'react';
import { withTranslation } from '../i18n';
import { WithTranslation } from 'next-i18next';
import { WithUser } from '../models/User';
import style from './dashboard.module.scss';

interface DashboardProps extends WithTranslation, WithUser {
};

class Dashboard extends React.Component<DashboardProps> {
  public static async getInitialProps() {
    return {
      namespacesRequired: ['common','dashboard',],
    };
  }

  public render() {
    return (
      <div className={style.root}>
        <h1>Welcome back <u>{this.props.user.username}</u>!</h1>
        <h3>({this.props.user.email})</h3>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
};

export default withTranslation()(Dashboard);