import Header from "../components/kainplan/landing/Header";
import style from './404.module.scss';
import { withTranslation, Link } from "../i18n";
import { WithTranslation } from 'next-i18next';

const Error = ({ t }: WithTranslation) => (
  <>
    <Header></Header>
    <div className={style.root}>
      <h1>{t('404:title')}</h1>
      <h3>{t('404:description')}</h3>
      <div>
        <a href={t('404:url')}>{t('404:info')}</a>
        <Link href="/">{t('404:go_back')}</Link>
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

export default withTranslation(['common','404',])(Error);