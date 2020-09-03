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

interface LoginProps extends WithTranslation {
};

class Login extends React.Component<LoginProps> {
  private usernameIn: ResponsiveInputBox;
  private passwordIn: ResponsiveInputBox;
  private toaster: ToastHandler;

  public static getInitialProps() {
    return {
      namespacesRequired: ['common','login',],
    };
  }

  private onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const uname: string = this.usernameIn.input.value;
    const pwd: string = this.passwordIn.input.value;

    if (!uname || !pwd) {
      this.toaster.showError(this.props.t('login:missing_in'), 8);
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
        this.toaster.showError(this.props.t('login:wrong_creds'), 8);
        return;
      }
      if (res.status !== 200) {
        this.toaster.showError(this.props.t('common:server_error'), 8);
        return;
      }
      Router.push('/dashboard');
    });
  }

  public render() {
    return (
      <>
        <Head>
          <title>{this.props.t('common:app_name')} ; {this.props.t('common:login')}</title>
        </Head>
        <Header>
          <HypedLink
            label={this.props.t('common:search')}
            href="/search"
            icon={faSearch}
          />
        </Header>
        <main className={style.root}>
          <WaveBackground animated position={WaveBackgroundPosition.BOTTOM} />
          <form onSubmit={this.onSubmit.bind(this)}>
            <h1>
              {this.props.t('common:login')} 
              <span>({this.props.t('login:or')} <Link href="/register"><span>{this.props.t('common:register')}</span></Link>)</span>
            </h1>
            <ResponsiveInputBox label={this.props.t('login:username')} ref={e => this.usernameIn = e} />
            <ResponsiveInputBox label={this.props.t('login:password')} type="password" ref={e => this.passwordIn = e} />
            <input type="submit" value={this.props.t('common:login').toString()} />
          </form>
          <ToastHandler 
            position={ToastPosition.BOTTOM_RIGHT} 
            ref={e => this.toaster = e}
          />
          <footer>
            <span>
              {this.props.t('common:copyright')}
            </span>
          </footer>
        </main>
      </>
    );
  }
}

export default withTranslation()(Login);