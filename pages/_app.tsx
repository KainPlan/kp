import { appWithTranslation } from '../i18n';
import '../styles/global.scss';
import NProgress from 'nprogress';
import '../styles/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import fetch from 'isomorphic-unfetch';

function KPApp({ Component, pageProps }): React.ReactElement {
  const router = useRouter();

  NProgress.configure({ showSpinner: false, });

  useEffect(() => {
    const changeStart = () => {
      NProgress.start();
    };
    const changeComplete = () => {
      NProgress.done();
    };
    const changeError = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', changeStart);
    router.events.on('routeChangeComplete', changeComplete);
    router.events.on('routeChangeError', changeError);

    return () => {
      router.events.off('routeChangeStart', changeStart);
      router.events.off('routeChangeComplete', changeComplete);
      router.events.off('routeChangeError', changeError);
    };
  }, []);

  return <Component {...pageProps} />;
}

KPApp.getInitialProps = async function({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (ctx.req && ctx.req.session.passport) {
    const userRes: any = await (await fetch(`http://localhost:3000/api/users/info/${ctx.req.session.passport.user}`)).json();
    pageProps = { ...pageProps, user: userRes.success ? userRes.user : undefined, };
  }
  return { pageProps };
};

export default appWithTranslation(KPApp);