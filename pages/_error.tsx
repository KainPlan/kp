import { withTranslation, Link } from '../i18n';
import { WithTranslation } from 'next-i18next';
import Header from '../components/kainplan/landing/Header';
import style from './_error.module.scss';

interface ErrorProps extends WithTranslation {
  statusCode: number;
}

function ErrorPage({ statusCode, t }: ErrorProps) {
  return (
    <>
      <Header></Header>
      <div className={style.root}>
        <h1>{t('_error:title', { code: statusCode, })}</h1>
        <h3>{t('_error:description')}</h3>
        <div>
          <a href={t('_error:url', { code: statusCode, })}>{t('_error:info')}</a>
          <Link href="/">{t('_error:go_back')}</Link>
        </div>
      </div>
      <style jsx global>{`
        html, body, #__next {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => ({
  statusCode: res ? res.statusCode : err ? err.statusCode : 404,
  namespacesRequired: ['common','_error',],
});

export default withTranslation()(ErrorPage);