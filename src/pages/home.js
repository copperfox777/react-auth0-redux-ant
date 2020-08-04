/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";

function HomePage() {
  const {
    loginWithPopup,
    logout,
  } = useAuth0();
  
  return (
    <div className="page-container">
      <Navbar title="Home"/>
      <main className="main-container">
        <ul>
        You can visit <Link to="/private">private</Link> links only after authentication. 
        If you are logged in, you can see some user info at <Link to="/about">about</Link> page.
        <br/>
          <li> <Link to="/">Home</Link> </li>
          <li> <a href="" onClick={loginWithPopup}> Sign In </a> </li>
          <li> <a href="" onClick={() => logout({ returnTo: "http://localhost:3000" })} > Sign Out </a> </li> 
          <li> <Link to="/about">About(public)</Link> </li>
          <li> <Link to="/private">Contacts (private) </Link> </li>
        </ul>
      </main>
    </div>
  );
}

export default HomePage;
