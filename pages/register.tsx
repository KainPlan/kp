import React from 'react';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import { withTranslation, Link } from '../i18n';
import HypedLink from '../components/kainplan/HypedLink';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/kainplan/landing/Header';
import style from './login.module.scss';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import ToastHandler from '../components/kainplan/ToastHandler';
import { ToastPosition } from '../components/kainplan/Toast';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';

interface RegisterProps extends WithTranslation {
};

interface RegisterState {
  showRepPass: boolean;
};

class Register extends React.Component<RegisterProps, RegisterState> {
  private emailIn: ResponsiveInputBox;
  private usernameIn: ResponsiveInputBox;
  private passwordIn: ResponsiveInputBox;
  private repPasswordIn: ResponsiveInputBox;
  private toaster: ToastHandler;

  constructor(props) {
    super(props);
    this.state = {
      showRepPass: false,
    };
  }

  public static getInitialProps() {
    return {
      namespacesRequired: ['common','login','register',],
    };
  }

  private onPasswordChange(pwd: string) {
    if (pwd) this.setState({ showRepPass: true, });
    else this.setState({ showRepPass: false, });
  }

  private onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const email: string = this.emailIn.input.value;
    const uname: string = this.usernameIn.input.value;
    const pwd: string = this.passwordIn.input.value;
    const repPwd: string = this.repPasswordIn.input.value;

    if (!email || !uname || !pwd || !repPwd) {
      this.toaster.showError(this.props.t('login:missing_in'), 8);
      return;
    }
    if (pwd.length < 8) {
      this.toaster.showError(this.props.t('register:short_pwd'), 8);
      return;
    }
    if (pwd !== repPwd) {
      this.toaster.showError(this.props.t('register:mismatch_pwd'), 8);
    }
  }

  public render() {
    return (
      <>
        <Head>
          <title>{this.props.t('common:app_name')} ; {this.props.t('common:register')}</title>
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
              <span style={{
                marginLeft: 0,
                marginRight: '3.5px',
              }}>(<Link href="/login"><span>{this.props.t('common:login')}</span></Link> {this.props.t('login:or')})</span>
              {this.props.t('common:register')}
            </h1>
            <ResponsiveInputBox label={this.props.t('register:email')} type="email" ref={e => this.emailIn = e} />
            <ResponsiveInputBox label={this.props.t('login:username')} ref={e => this.usernameIn = e} />
            <ResponsiveInputBox label={this.props.t('login:password')} type="password" ref={e => this.passwordIn = e} onContentChange={this.onPasswordChange.bind(this)} />
            <ResponsiveInputBox label={this.props.t('register:rep_password')} type="password" ref={e => this.repPasswordIn = e} style={{
              display: this.state.showRepPass ? 'block' : 'none',
            }} />
            <input type="submit" value={this.props.t('common:register').toString()} />
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

export default withTranslation()(Register);