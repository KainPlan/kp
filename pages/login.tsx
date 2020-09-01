import React from 'react';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import ToastHandler from '../components/kainplan/ToastHandler';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import HypedLink, { HypedIconPosition } from '../components/kainplan/HypedLink';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import { ToastPosition } from '../components/kainplan/Toast';
import Head from 'next/head';
import Header from '../components/kainplan/landing/Header';
import style from './login.module.scss';

class Login extends React.Component {
  private usernameIn: ResponsiveInputBox;
  private passwordIn: ResponsiveInputBox;
  private toaster: ToastHandler;

  private onSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  public render() {
    return (
      <>
        <Head>
          <title>KainPlan ; Login</title>
        </Head>
        <Header>
          <HypedLink
            label="Home"
            href="/"
            icon={faAngleDoubleLeft}
            position={HypedIconPosition.BEFORE}
          />
        </Header>
        <main className={style.root}>
          <WaveBackground animated position={WaveBackgroundPosition.BOTTOM} />
          <form onSubmit={this.onSubmit.bind(this)}>
            <h1>Anmelden</h1>
            <ResponsiveInputBox label="Nutzername" ref={e => this.usernameIn = e} />
            <ResponsiveInputBox label="Passwort" type="password" ref={e => this.passwordIn = e} />
            <input type="submit" value="Login" />
          </form>
          <ToastHandler 
            position={ToastPosition.BOTTOM_RIGHT} 
            ref={e => this.toaster = e}
          />
          <footer>
            <span>
              design &copy; KainPlan
              <span>jk</span>
            </span>
          </footer>
        </main>
      </>
    );
  }
}

export default Login;