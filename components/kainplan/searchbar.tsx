import React from 'react';
import map_management_style from './map_management.module.scss';

const Bar = () => (
  <div className={map_management_style.searchbar}>
    <script src="https://kit.fontawesome.com/a076d05399.js"></script>
    {/* <h1>Searchbar</h1> */}
    <div className={map_management_style.dropdown}>
      <a className={map_management_style.searchbarItems}>Home</a>
      <div className={map_management_style.dropdown_content}>
        <a>test</a><br />
        <a>test</a><br />
        <a>test</a>
      </div>
    </div>

    <div className={map_management_style.dropdown}>
      <a className={map_management_style.searchbarItems}>Standorte</a>
      <div className={map_management_style.dropdown_content}>
        <a>test</a><br />
        <a>test</a><br />
        <a>test</a>
      </div>
    </div>
    
    <div className={map_management_style.dropdown}>
      <a className={map_management_style.searchbarItems}>Karten</a>
      <div className={map_management_style.dropdown_content}>
        <a>test</a><br />
        <a>test</a><br />
        <a>test</a>
      </div>
    </div>

    <div className={map_management_style.dropdown}>
      <a className={map_management_style.searchbarItems}><i className="fas fa-user"></i></a>
      <div className={map_management_style.dropdown_content}>
        <a>test</a><br />
        <a>test</a><br />
        <a>test</a>
      </div>
    </div>
    
    <div className={map_management_style.dropdown}>
      <a className={map_management_style.searchbarItems}><i className={"fas fa-search"} ></i></a>
    </div>

  </div>
);

export default Bar;