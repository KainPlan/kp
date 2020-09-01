import { appWithTranslation } from '../i18n';
import '../styles/global.scss';
import NProgress from 'nprogress';
import '../styles/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

export default appWithTranslation(KPApp);