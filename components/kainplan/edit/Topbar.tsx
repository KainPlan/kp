import React from 'react';
import style from './Topbar.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSave } from '@fortawesome/free-solid-svg-icons';

const Topbar = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className={style.topbar}>
        <div><i className={style.topbarItem}><FontAwesomeIcon icon={faSave} /></i></div>
        <div className={style.topbarCenter}><a className={style.topbarCenterItem}>HTL Kaindorf - EG</a></div>
        <div><i className={style.topbarItem}><FontAwesomeIcon icon={faUser} /></i></div> 
    </div>
));

export default Topbar;