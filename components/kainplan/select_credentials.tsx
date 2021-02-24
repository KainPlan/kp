import React from 'react';
import Location from './location';
import Map from './create_map';
import map_management_style from './map_management.module.scss';

const selectCredentials = () => (
    <div className={map_management_style.selectCredentials}>
        <Location />
        <Map />
    </div>
);

export default selectCredentials;