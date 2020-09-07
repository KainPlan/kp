import React, { useState, useEffect } from 'react';

import style from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import TenFingers from '../components/tenfingers/TenFingers';
import Particles from 'react-particles-js';
import { withTranslation, Link } from '../i18n';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import { WithUser } from '../models/User';
import useUser from '../components/kainplan/auth/UserContext';
import fetch from 'isomorphic-unfetch';

interface SearchProps extends WithTranslation, WithUser {
}

const Search = ({ t, }: SearchProps) => {
  var root: HTMLDivElement;
  var queryIn: HTMLInputElement;
  var cuTimeout: number;

  const [msr, setMsr] = useState({ width: 0, height: 0, });
  const [active, setActive] = useState(false);
  const [res, setRes] = useState([]);

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
  
  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let qry: string = queryIn.value.trim();
    if (qry === '') return setRes([]);
    fetch(`/api/maps/search/${qry}`)
      .then(res => {
        if (!res.ok) return window.alert('error');
        return res.json();
      })
      .then(res => {
        if (!res.success) return window.alert('error');
        setRes(res.body);
      });
  };

  const onInputChange = () => {
    if (cuTimeout) window.clearTimeout(cuTimeout);
    cuTimeout = window.setTimeout(() => onSearch(), 400);
  };

  const onFocus = () => {
    setActive(true);
  };

  const onBlur = () => {
    setActive(Boolean(queryIn && queryIn.value));
  };

  const onClearInput = () => {
    queryIn.value = '';
    queryIn.focus();
  };

  const onView = (id: string) => {
    console.log(`Opening map ${id} ... `);
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
              <input ref={e => queryIn = e} onFocus={onFocus} onBlur={onBlur} onKeyUp={onInputChange} type="text" />
              <p style={{
                display: active ? 'none' : 'block',
              }}>
                <TenFingers 
                  values={t('search:examples', { returnObjects: true, })}
                />
              </p>
              <i onClick={onClearInput} style={{
                display: active ? 'block' : 'none',
              }}><FontAwesomeIcon icon={faTimes} /></i>
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
            {
              res.map(r => <div onClick={() => onView(r._id)}>
                <div>
                  <h4>{r.name}</h4>
                  <p>{r.desc}</p>
                </div>
                <i><FontAwesomeIcon icon={faArrowRight} /></i>
              </div>)
            }
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