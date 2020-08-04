/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/navbar";
import {Button} from 'antd';

  function About() {
    const {
      user,
      isAuthenticated,
      loginWithRedirect,
      loginWithPopup
    } = useAuth0();
  
    const infoText = isAuthenticated ? '' : <p>Public page. <a  onClick={()=>loginWithPopup()} > Sign in  </a> to see user info.</p>;
    return(
      <div className="page-container">
        <Navbar title="About"/>
        <main className="main-container">
        {infoText}
          {
          user && Object.keys(user).map((key)=> {return(<div key={key}>{key} : {user[key]}</div>)})
          }
        </main>
      </div>
    )
  }
  
  export default About;