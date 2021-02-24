import React from 'react';
import map_management_style from './map_management.module.scss';

const ShowMap = () => (
    <div className={map_management_style.show_map}>
        <a className={map_management_style.show_map_text}>Datei hier ablegen oder</a>
        <br />
        <button className={map_management_style.show_map_text} onClick={() => alert("Datei auswählen")}>Auswählen</button>
    </div>
);

export default ShowMap;