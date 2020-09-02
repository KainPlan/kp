import style from './index.module.scss';
import Header from '../components/kainplan/landing/Header';
import Footer from '../components/kainplan/landing/Footer';
import React from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import HypedLink from '../components/kainplan/HypedLink';
import { withTranslation } from '../i18n';
import { WithTranslation } from 'next-i18next';

interface IndexProps extends WithTranslation {
}

class Index extends React.Component<IndexProps, any> {
  public static async getInitialProps() {
    return {
      namespacesRequired: ['common','index',],
    };
  }

  private onScrollClick() {
    window.document.getElementsByTagName('main')[0].scrollIntoView({
      behavior: 'smooth',
    });
  }

  public render() {
    return (
      <>
        <Head>
          <title>{this.props.t('common:app_name')}</title>
        </Head>
        <Header>
          <HypedLink
            label={this.props.t('index:go')}
            href='/search'
            icon={faExternalLinkAlt}
          />
        </Header>
        <article className={style.root}>
          <div className={style.topMain}>
            <div className={style.topMainInner}>
              <video autoPlay muted loop>
                <source src="/media/49d6c2a710af4aaf.mp4" type="video/mp4" />
              </video>
              <div className={style.topFore}>
                <img src={require('../images/lgtd.png')} />
              </div>
            </div>
            <div className={style.scrollDownContainer} onClick={this.onScrollClick}>
              <i><FontAwesomeIcon icon={faAngleDoubleDown} /></i>
            </div>
          </div>
          <main>
            <div className={style.infoElement}>
              <div className={style.quoteDiv}>
                <q>Unsere Schule - kartografiert</q>
                <p>Moderne Navigationssoftware die Ihnen hilft, immer den richtigen Pfad durch unser Schulgebäude zu finden.</p>
              </div>
            </div>
            <div className={style.infoElement}>
              <div className={style.quoteDiv}>
                <q>Neue Aspekte der Schule entdecken - mit KainPlan</q>
              </div>
              <div className={style.imgContainer}>
                <img src={require('../images/index/img1.png')} />
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
            <div className={style.infoElement}>
              <div className={style.quoteDiv}>
                <q>Seitdem wir KainPlan verwenden, haben wir uns nie wieder verlaufen!</q><span>Hänsel und Gretel, 2019</span>
              </div>
              <div className={style.imgContainer}>
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <img src={require('../images/index/img2.png')} />
              </div>
            </div>
            <div className={style.infoElement}>
              <div className={style.quoteDiv}>
                <q>Eine UI so minimalistisch - sogar die Schulkatze könnte sie verwenden</q>
              </div>
              <div className={style.videoContainer}>
                <div className={style.videoFinal}>
                  <video autoPlay loop>
                    <source src="/media/b4fbb5cb4feb4af8.mp4" type="video/mp4" />
                  </video>
                  <div className={style.overlay}></div>
                </div>
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
          </main>
        </article>
        <Footer />
      </>
    );
  }
}

export default withTranslation()(Index);