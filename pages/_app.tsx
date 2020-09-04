import { appWithTranslation } from '../i18n';
import '../styles/global.scss';
import NProgress from 'nprogress';
import '../styles/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UserProvider } from '../components/kainplan/auth/UserContext';

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

  return (
    <UserProvider passport={pageProps.passport}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

KPApp.getInitialProps = async function({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (ctx.req && ctx.req.session.passport) {
    pageProps = {...pageProps, passport: ctx.req.session.passport, };
  }
  return { pageProps };
};

export default appWithTranslation(KPApp);