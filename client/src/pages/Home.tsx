import * as React from 'react';
import { useState } from 'react';
import { NavigationBar } from "../components/Navbar"
import { LoginPopUp } from "../components/LoginPopUp"
import { RegistrationPopUp } from "../components/RegistrationPopUp"


import "./Css/Home.css"

export interface Props {

}

export const Home = () => {

  const [regPopUpOpen, setRegPopUpOpen] = useState<boolean>(false)
  const [loginPopUpOpen, setLoginPopUpOpen] = useState<boolean>(false)

  const showRegPopUp = (): void => {
    if (loginPopUpOpen) {
      setLoginPopUpOpen(false)
    }
    setRegPopUpOpen(true)
  }
  const showLoginPopUp = (): void => {
    if (regPopUpOpen) {
      setRegPopUpOpen(false)
    }
    setLoginPopUpOpen(true)
  }
  return (
    <div className="home">
      <NavigationBar loggedIn = {false}></NavigationBar>
      <div className="home_container">

        <div className="get_started_container">
          <h1 className = "get_started_container_title">All the study tools you need in one place!</h1>
          <h3 className = "get_started_container_subtitle">Create your own cue cards and use a pomodoro timer for effective studying</h3>
          <div className="get_started_button_container">
            <button onClick={showRegPopUp} className="sign_up_btn">Register</button>
            <button onClick={showLoginPopUp} className="sign_in_btn">Login</button>
          </div>
        </div>

      </div>
      {regPopUpOpen ? (
      <div className="reg_pop_up">
        <RegistrationPopUp
          regPopUpOpen = {regPopUpOpen}
          setRegPopUpOpen = {setRegPopUpOpen}
        ></RegistrationPopUp>
      </div>
      ): null}
      {loginPopUpOpen ? (
        <div className="login_pop_up">
          <LoginPopUp 
            loginPopUpOpen = {loginPopUpOpen}
            setLoginPopUpOpen = {setLoginPopUpOpen}
          ></LoginPopUp>
        </div>
      ) : null}


    </div>
  );
}
