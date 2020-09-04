import React from 'react';
import { withTranslation } from '../i18n';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import Header from '../components/kainplan/landing/Header';
import HypedLink from '../components/kainplan/HypedLink';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import style from './team.module.scss';
import ArticleHeader, { ArticleHeaderForegroundType, ArticleHeaderBackgroundType } from '../components/kainplan/landing/ArticleHeader';
import Footer from '../components/kainplan/landing/Footer';

interface TeamProps extends WithTranslation {
};

const Team = ({ t, }: TeamProps) => {
  const onPersonClick = (i: number) => {
    document.getElementById(`person-${i}`).scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Head>
        <title>{t('common:app_name')} ; {t('common:team')}</title>
      </Head>
      <Header>
        <HypedLink
          label={t('team:start_now')}
          href='/search'
          icon={faExternalLinkAlt}
        />
      </Header>
      <article className={style.root}>
        <ArticleHeader 
          background={require('../images/team/header.jpg')} 
          backgroundType={ArticleHeaderBackgroundType.IMAGE} 
          foreground={require('../images/lgtd.png')} />
        <main>
          <div>
            <h2>{t('team:our_team')}</h2>
            {t('team:introduction')}
          </div>
          <div className={style.people}>
            <div onClick={() => onPersonClick(0)}>
              <h4>Moritz Rief</h4>
              <p>{t('team:moritz_title')}</p>
            </div>
            <div onClick={() => onPersonClick(1)}>
              <h4>Nico Pessnegger</h4>
              <p>{t('team:nico_title')}</p>
            </div>
            <div onClick={() => onPersonClick(2)}>
              <h4>David Weinhandl</h4>
              <p>{t('team:david_title')}</p>
            </div>
            <div onClick={() => onPersonClick(3)}>
              <h4>Matthias Monschein</h4>
              <p>{t('team:matthias_title')}</p>
            </div>
          </div>
          <div id="person-0" className={style.person}>
            <h2>Moritz Rief</h2>
            <h5>{t('team:moritz_title')}</h5>
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in lacinia urna. Nunc luctus diam mi. Nunc quis quam bibendum, laoreet diam et, gravida elit. Suspendisse et neque sit amet nisi imperdiet ullamcorper. Aliquam erat volutpat. In sit amet ante non neque aliquam vehicula sit amet iaculis felis. Suspendisse potenti. In hac habitasse platea dictumst. Vestibulum quis dui laoreet augue consequat blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ornare imperdiet ante sit amet cursus. Duis id massa purus. Sed nulla urna, rutrum id fermentum semper, placerat in sem. Sed faucibus aliquet est in efficitur.</p>
              <img src={require('../images/team/moritz.jpg')} />
            </div>
          </div>
          <div id="person-1" className={style.person}>
            <h2>Nico Pessnegger</h2>
            <h5>{t('team:nico_title')}</h5>
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in lacinia urna. Nunc luctus diam mi. Nunc quis quam bibendum, laoreet diam et, gravida elit. Suspendisse et neque sit amet nisi imperdiet ullamcorper. Aliquam erat volutpat. In sit amet ante non neque aliquam vehicula sit amet iaculis felis. Suspendisse potenti. In hac habitasse platea dictumst. Vestibulum quis dui laoreet augue consequat blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ornare imperdiet ante sit amet cursus. Duis id massa purus. Sed nulla urna, rutrum id fermentum semper, placerat in sem. Sed faucibus aliquet est in efficitur.</p>
              <img src={require('../images/team/nico.jpg')} />
            </div>
          </div>
          <div id="person-2" className={style.person}>
            <h2>David Weinhandl</h2>
            <h5>{t('team:david_title')}</h5>
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in lacinia urna. Nunc luctus diam mi. Nunc quis quam bibendum, laoreet diam et, gravida elit. Suspendisse et neque sit amet nisi imperdiet ullamcorper. Aliquam erat volutpat. In sit amet ante non neque aliquam vehicula sit amet iaculis felis. Suspendisse potenti. In hac habitasse platea dictumst. Vestibulum quis dui laoreet augue consequat blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ornare imperdiet ante sit amet cursus. Duis id massa purus. Sed nulla urna, rutrum id fermentum semper, placerat in sem. Sed faucibus aliquet est in efficitur.</p>
              <img src={require('../images/team/david.jpg')} />
            </div>
          </div>
          <div id="person-3" className={style.person}>
            <h2>Matthias Monschein</h2>
            <h5>{t('team:matthias_title')}</h5>
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in lacinia urna. Nunc luctus diam mi. Nunc quis quam bibendum, laoreet diam et, gravida elit. Suspendisse et neque sit amet nisi imperdiet ullamcorper. Aliquam erat volutpat. In sit amet ante non neque aliquam vehicula sit amet iaculis felis. Suspendisse potenti. In hac habitasse platea dictumst. Vestibulum quis dui laoreet augue consequat blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi ornare imperdiet ante sit amet cursus. Duis id massa purus. Sed nulla urna, rutrum id fermentum semper, placerat in sem. Sed faucibus aliquet est in efficitur.</p>
              <img src={require('../images/team/matthias.jpg')} />
            </div>
          </div>
        </main>
        <Footer />
      </article>
    </>
  );
};

Team.getInitialProps = async () => ({
  namespacesRequired: ['common','team',],
});

export default withTranslation()(Team);