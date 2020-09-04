import React from 'react';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import ToastHandler from '../components/kainplan/ToastHandler';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import HypedLink from '../components/kainplan/HypedLink';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import { ToastPosition } from '../components/kainplan/Toast';
import Head from 'next/head';
import Header from '../components/kainplan/landing/Header';
import style from './login.module.scss';
import { withTranslation, Link, Router } from '../i18n';
import { WithTranslation } from 'next-i18next';
import fetch from 'isomorphic-unfetch';
import { WithUser } from '../models/User';

interface LoginProps extends WithTranslation, WithUser {
};

const Login = ({ t, }: LoginProps) => {
  let usernameIn: ResponsiveInputBox;
  let passwordIn: ResponsiveInputBox;
  let toaster: ToastHandler;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uname: string = usernameIn.input.value;
    const pwd: string = passwordIn.input.value;

    if (!uname || !pwd) {
      toaster.showError(t('login:missing_in'), 8);
      return;
    }

    fetch('/api/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: uname,
        password: pwd,
      }),
    }).then(res => {
      if (res.status === 401) {
        toaster.showError(t('login:wrong_creds'), 8);
        return;
      }
      if (res.status !== 200) {
        toaster.showError(t('common:server_error'), 8);
        return;
      }
      Router.push('/dashboard');
    });
  };

  return (
    <>
      <Head>
        <title>{t('common:app_name')} ; {t('common:login')}</title>
      </Head>
      <Header>
        <HypedLink
          label={t('common:search')}
          href="/search"
          icon={faSearch}
        />
      </Header>
      <main className={style.root}>
        <WaveBackground animated position={WaveBackgroundPosition.BOTTOM} />
        <form onSubmit={onSubmit}>
          <h1>
            {t('common:login')} 
            <span>({t('login:or')} <Link href="/register"><span>{t('common:register')}</span></Link>)</span>
          </h1>
          <ResponsiveInputBox label={t('login:username')} ref={e => usernameIn = e} />
          <ResponsiveInputBox label={t('login:password')} type="password" ref={e => passwordIn = e} />
          <input type="submit" value={t('common:login').toString()} />
        </form>
        <ToastHandler 
          position={ToastPosition.BOTTOM_RIGHT} 
          ref={e => toaster = e}
        />
        <footer>
          <span>
            {t('common:copyright')}
          </span>
        </footer>
      </main>
    </>
  );
};

Login.getInitialProps = async () => ({
  namespacesRequired: ['common','login',],
});

export default withTranslation()(Login);