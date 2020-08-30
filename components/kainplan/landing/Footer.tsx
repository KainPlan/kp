import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeSquare, faSchool } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faInstagram, faReddit } from '@fortawesome/free-brands-svg-icons';

import style from './Footer.module.scss';

const Footer = () => (
  <footer className={style.root}>
    <div className={style.footerLogoContainer}>    
      <img src="/media/logo_and_text_bright.png" />
    </div>
    <div className={style.footerContentContainer}>
      <h3>// Kontakt</h3>
      <div className={style.footerPart}>
        <a className="icon-link" href="mailto:kainplan@htl-kaindorf.ac.at" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faEnvelopeSquare} />
          </i>
        </a>
        <a className="icon-link" href="//htl-kaindorf.at" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faSchool} />
          </i>
        </a>
        <a className="icon-link" href="//twitter.com/k41npl4n" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faTwitterSquare} />
          </i>
        </a>
        <a className="icon-link" href="//reddit.com/user/k41npl4n" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faReddit} />
          </i>
        </a>
        <a className="icon-link" href="//instagram.com/kainplan" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faInstagram} />
          </i>
        </a>
      </div>
      <h3>// Links</h3>
      <div className={style.footerPart}>
        <Link href="/map">
          <a>Karte</a>
        </Link>
        <Link href="/team">
          <a>Team</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
      <div className={style.copyrightNotice}>
        &copy; 2020 KainPlan GmbH
      </div>
    </div>
  </footer>
);

export default Footer;