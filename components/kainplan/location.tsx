import React from 'react';
import map_management_style from './map_management.module.scss';

import LocItem from './location_item';

const Loc = () => (
    <div className={map_management_style.location}>
        <script src="https://kit.fontawesome.com/a076d05399.js"></script>
        {/* <h1>Location</h1> */}
        {/* <LocItem /> */}
        <table className={map_management_style.credentialsTable}>
            <thead>
                <tr className={map_management_style.tableHeader}>
                    <td>Location</td>
                </tr>
            </thead>
            <tbody>
                <tr><td>EG</td></tr>
                <tr><td>Stock 1</td></tr>
                <tr><td>Stock 2</td></tr>
            </tbody>
        </table>
        <a className={map_management_style.add_item} onClick={() => alert("Add Location")}><i  className="fas fa-plus"></i></a>
        {/*<i className="far fa-plus-circle"></i>*/}
        {/*<button className={map_management_style.add_item} onClick={() => alert("Add Location")}></button>*/}
    </div>
);

export default Loc;