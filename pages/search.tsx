import React from 'react';

import style from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faThList } from '@fortawesome/free-solid-svg-icons';
import TenFingers from '../components/tenfingers/TenFingers';
import Particles from 'react-particles-js';
import Header from '../components/kainplan/landing/Header';
import Link from 'next/link';

interface SearchProps {
}

interface SearchState {
  active: boolean;
  width: number;
  height: number;
}

class Search extends React.Component<SearchProps, SearchState> {
  private root: HTMLDivElement;
  private form: HTMLFormElement;
  private queryIn: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      width: 0,
      height: 0,
    };
  }

  public componentDidMount() {
    window.addEventListener('resize', this.refreshMeasurements.bind(this));
    this.refreshMeasurements();
  }

  private refreshMeasurements() {
    let br = this.root.getBoundingClientRect();
    this.setState({
      width: br.width,
      height: br.height,
    });
  }

  private onSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  private onFocus() {
    this.setState({ active: true, });
  }

  private onBlur() {
    this.setState({ active: false, });
  }

  public render() {
    return (
      <div ref={e => this.root = e} className={style.root}>
        <header>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </header>
        <h1>KainPlan</h1>
        <form ref={e => this.form = e} onSubmit={this.onSearch.bind(this)}>
          <div>
            <input ref={e => this.queryIn = e} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} type="text" />
            <p style={{
              display: (this.state.active || this.queryIn && this.queryIn.value) ? 'none' : 'block',
            }}>
              <TenFingers 
                values={[
                  'HTBLA Kaindorf',
                  'Volkshochschule Steiermark',
                  '...'
                ]}
              />
            </p>
          </div>
          <button type="submit">
            <i><FontAwesomeIcon icon={faSearch} /></i>
          </button>
        </form>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
        <footer>
          &copy; 2020 KainPlan
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
            width={this.state.width + 'px'}
            height={this.state.height + 'px'}
          />
        </div>
      </div>
    );
  }
}

export default Search;