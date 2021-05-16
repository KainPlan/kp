import React from 'react';
import style from './Topbar.module.scss';
import { Link } from '../../../i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Topbar = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className={style.topbar}>
        <div>
            <a>
                <Link href="/dashboard">
                    <i className={style.topbarItem}><FontAwesomeIcon icon={faArrowLeft} /></i>
                </Link>
            </a>
        </div>
        <div className={style.topbarCenter}><a className={style.topbarCenterItem}>Editor</a></div>
        <div><i className={style.topbarItem}><FontAwesomeIcon icon={faUser} /></i></div> 
    </div>
));

export default Topbar;