
import * as React from 'react';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TimerContext } from '../helpers/Contexts';

import "./Css/Navbar.css"

export interface IAppProps {
  loggedIn: boolean;
}

export function NavigationBar({ loggedIn }: IAppProps) {
  const [isActive, setIsActive] = useState(false);
  let history = useHistory()
  


  const toggle = () => {
    console.log('isactive', isActive)
    setIsActive(!isActive)
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("studyTimeInSec");
    localStorage.removeItem("breakTimeInSec");
    localStorage.removeItem("folderIdFromURL")
    localStorage.removeItem("numFolders")
    localStorage.removeItem("folderName")
    localStorage.removeItem("setId")
    localStorage.removeItem("setName")
    history.push("./")
  }


  return (
    <nav className="navbar">
      <div className="brand_title">
        STUDYWEB
      </div>
      <div className="brand_title_C">
        STUDYWEB
      </div>

      {loggedIn ? (
        <>
          <div className="navbar_links">
            <ul>
              <div className="nav_folder_and_sets">
                <li><a onClick={() => { history.push("./user") }}>Home</a></li>
                <li><a onClick={() => { history.push("./listFolders") }} className="nav_folder">Folders</a></li>
                <li><a onClick={() => { history.push("./listSets") }} className="nav_sets">Sets</a></li>
              </div>
              <div className="nav_logout_container">
                <li><a className="nav_logout" onClick={logout}>Logout</a></li>
              </div>
            </ul>
          </div>

          <div className="toggle_wrapper">
            <a href="#" className="toggle_button" onClick={toggle}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </a>
          </div>
          {isActive ? (
            <div className="navbar_links_V">
              <ul>
                <li><a onClick={() => { history.push("./user") }}>Home</a></li>
                <li><a onClick={() => { history.push("./listFolders") }}>Folders</a></li>
                <li><a onClick={() => { history.push("./listSets") }}>Sets</a></li>
                <li><a onClick={() => { history.push("./") }}>Logout</a></li>
              </ul>
            </div>
          ) : null}
        </>
      ) : null}


    </nav>



  );
}
