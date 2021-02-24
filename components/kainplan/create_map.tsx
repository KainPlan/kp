import React from 'react';
import map_management_style from './map_management.module.scss';

const Map = () => (
    <div className={map_management_style.map}>
        <script src="https://kit.fontawesome.com/a076d05399.js"></script>
        {/* <h1>Map</h1> */}
        <table className={map_management_style.credentialsTable}>
            <thead>
                <tr className={map_management_style.tableHeader}>
                    <td>Map</td>
                </tr>
            </thead>
            <tbody>
                <tr><td>Karte 1</td></tr>
                <tr><td>Karte 2</td></tr>
                <tr><td>Karte 3</td></tr>
            </tbody>
        </table>
        
        <a className={map_management_style.add_item} onClick={() => alert("Add Map")}><i className="fas fa-plus"></i></a>
    </div>
);

export default Map;