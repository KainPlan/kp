import React from 'react';
import style from './Topbar.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Topbar = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className={style.topbar}>
        <i className={style.topbarItem}>HTL Kaindorf</i>
        <i className={style.topbarItem}><FontAwesomeIcon icon={faUser}/></i>
    </div>
));

export default Topbar;