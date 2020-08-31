import React from 'react';
import TenFingers from '../../tenfingers/TenFingers';
import { withTranslation, Link } from '../../../i18n';
import { WithTranslation } from 'next-i18next';

import style from './Header.module.scss';

interface HeaderProps extends WithTranslation {
  children?: React.ReactNode;
}

interface HeaderState {
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  header: HTMLElement;

  public componentDidMount() {
    let prev: number = window.scrollY;
    window.onscroll = () => {
      if (!this.header) return;
      let diff: number = window.scrollY - prev;
      if (diff < 0 || window.scrollY === 0 || window.scrollY + window.innerHeight >= window.document.body.offsetHeight) {
        this.header.style.top = '0px';
      } else {
        this.header.style.top = +this.header.style.top.replace('px', '') - diff + 'px';
      }
      prev = window.scrollY;
    };
  }

  public render() {
    return (
      <header className={style.root} ref={e => this.header = e}>
        <Link href="/">
          <h1>
            <TenFingers
              values={[this.props.t('app_name')]}
            />
          </h1>
        </Link>
        <div>
          {this.props.children}
        </div>
      </header>     
    );
  }
}

export default withTranslation('common')(Header);