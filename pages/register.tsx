import React, { useState } from 'react';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import { withTranslation, Link, Router } from '../i18n';
import HypedLink from '../components/kainplan/HypedLink';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/kainplan/landing/Header';
import style from './login.module.scss';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import ToastHandler from '../components/kainplan/ToastHandler';
import { ToastPosition } from '../components/kainplan/Toast';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import fetch from 'isomorphic-unfetch';

interface RegisterProps extends WithTranslation {
};

const Register = ({ t, }: RegisterProps) => {
  let emailIn: ResponsiveInputBox;
  let usernameIn: ResponsiveInputBox;
  let passwordIn: ResponsiveInputBox;
  let repPasswordIn: ResponsiveInputBox;
  let toaster: ToastHandler;

  const [showRepPass, setShowRepPass] = useState(false);

  const onPasswordChange = (pwd: string) => {
    if (pwd) return setShowRepPass(true);
    setShowRepPass(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email: string = emailIn.input.value;
    const uname: string = usernameIn.input.value;
    const pwd: string = passwordIn.input.value;
    const repPwd: string = repPasswordIn.input.value;

    if (!email || !uname || !pwd || !repPwd) {
      toaster.showError(t('login:missing_in'), 8);
      return;
    }
    if (email.length > 40) {
      toaster.showError(t('register:long_email'), 8);
      return;
    }
    if (pwd.length < 8) {
      toaster.showError(t('register:short_pwd'), 8);
      return;
    }
    if (pwd !== repPwd) {
      toaster.showError(t('register:mismatch_pwd'), 8);
      return;
    }

    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: uname,
        password: pwd,
      }),
    }).then(res => {
      if (res.status !== 200) {
        toaster.showError(t('common:server_error'), 8);
        return;
      }
      Router.push('/login');
    }).catch(err => toaster.showError(t('common:server_error'), 8));
  };

  return (
    <>
      <Head>
        <title>{t('common:app_name')} ; {t('common:register')}</title>
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
            <span style={{
              marginLeft: 0,
              marginRight: '3.5px',
            }}>(<Link href="/login"><span>{t('common:login')}</span></Link> {t('login:or')})</span>
            {t('common:register')}
          </h1>
          <ResponsiveInputBox label={t('register:email')} type="email" ref={e => emailIn = e} />
          <ResponsiveInputBox label={t('login:username')} ref={e => usernameIn = e} />
          <ResponsiveInputBox label={t('register:password')} type="password" ref={e => passwordIn = e} onContentChange={onPasswordChange} />
          <ResponsiveInputBox label={t('register:rep_password')} type="password" ref={e => repPasswordIn = e} style={{
            display: showRepPass ? 'block' : 'none',
          }} />
          <input type="submit" value={t('common:register').toString()} />
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

Register.getInitialProps = () => ({
  namespacesRequired: ['common','login','register',],
});

export default withTranslation()(Register);