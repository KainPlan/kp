import React, { useState, useEffect } from 'react';

import style from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import TenFingers from '../components/tenfingers/TenFingers';
import Particles from 'react-particles-js';
import { withTranslation, Link } from '../i18n';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import { WithUser } from '../models/User';
import useUser from '../components/kainplan/auth/UserContext';

interface SearchProps extends WithTranslation, WithUser {
}

interface SearchState {
  active: boolean;
  width: number;
  height: number;
}

const Search = ({ t, }: SearchProps) => {
  var root: HTMLDivElement;
  var queryIn: HTMLInputElement;

  const [msr, setMsr] = useState({ width: 0, height: 0, });
  const [active, setActive] = useState(false);

  const { user, authenticated, loading, } = useUser();

  const refreshMeasurements = () => {
    if (!root) return;
    let br: DOMRect = root.getBoundingClientRect();
    setMsr({
      width: br.width,
      height: br.height,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', refreshMeasurements);
    refreshMeasurements();
  }, []);
  
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let qry: string = queryIn.value;
  };

  const onFocus = () => {
    setActive(true);
  };

  const onBlur = () => {
    setActive(Boolean(queryIn && queryIn.value));
  };

  return (
    <>
      <Head>
        <title>{t('common:app_name')} ; {t('common:search')}</title>
      </Head>
      <div ref={e => root = e} className={style.root}>
        <header>
          <Link href="/">
            <a>{t('common:home')}</a>
          </Link>
          {
            !loading && authenticated
            ? <Link href="/dashboard">
                <a><FontAwesomeIcon icon={faUser} /> {user!.username}</a>
              </Link>
            : <Link href="/login">
                <a>{t('common:login')}</a>
              </Link>
          }
        </header>
        <h1>{t('common:app_name')}</h1>
        <form onSubmit={onSearch}>
          <div className={style.queryDiv}>
            <div style={{
              borderRadius: active ? '14px 0 0 0' : '14px 0 0 14px',
            }}>
              <input ref={e => queryIn = e} onFocus={onFocus} onBlur={onBlur} type="text" />
              <p style={{
                display: active ? 'none' : 'block',
              }}>
                <TenFingers 
                  values={t('search:examples', { returnObjects: true, })}
                />
              </p>
            </div>
            <button type="submit" style={{
              borderRadius: active ? '0 14px 0 0' : '0 14px 14px 0',
            }}>
              <i><FontAwesomeIcon icon={faSearch} /></i>
            </button>
          </div>
          <div className={style.querySuggs} style={{
            display: active ? 'block' : 'none',
          }}>
            <div>
              <div>
                <h4>HTBLA Kaindorf</h4>
                <p>Schule im Süden der Steiermark</p>
              </div>
              <i><FontAwesomeIcon icon={faArrowRight} /></i>
            </div>
            <div>
              <div>
                <h4>Volkshochschule Steiermark</h4>
                <p>Institution in Graz</p>
              </div>
              <i><FontAwesomeIcon icon={faArrowRight} /></i>
            </div>
          </div>
        </form>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
        <footer>
          {t('common:copyright')}
        </footer>
        <div className={style.particles}>
          <Particles 
            params={{
              particles: {
                number: {
                  value: 50
                },
                size: {
                  value: 3
                },
                color: {
                  value: '#999',
                },
                line_linked: {
                  color: '#dedede',
                },
              }
            }} 
            width={msr.width + 'px'}
            height={msr.height + 'px'}
          />
        </div>
      </div>
    </>
  );
};

Search.getInitialProps = () => ({
  namespacesRequired: ['common','search',],
});

export default withTranslation()(Search);