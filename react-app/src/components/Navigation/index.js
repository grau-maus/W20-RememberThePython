import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Nav, Navbar, Button } from "react-bootstrap";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignUpModal from "../SignUpModal";
import * as sessionActions from "../../store/session";
import { searchQuery } from "../../store/search";

import "./Navigation.css";
import searchIcon from "../../images/icons/font-awesome/search-solid.svg";

const Navigation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [search, setSearch] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  let sessionLinks;
  let searchBar;

  const handleSubmit = () => {
    setIsLoggingIn(true);

    let retries = 0;
    const loginInterval = setInterval(async () => {
      if (retries < 5) {
        const data = await dispatch(
          sessionActions.login({
            credential: "demoUser@user.io",
            password: "passwords",
          })
        );

        if (data && data.status === 200) {
          clearInterval(loginInterval);
          history.go(0);
          return;
        }

        retries += 1;
      } else {
        setIsLoggingIn(false);
        clearInterval(loginInterval);
      }
    }, 500);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await dispatch(searchQuery(search));
    document.querySelector("#sideNav-tab-search").click();
    document.querySelector("#search-bar").value = "";
    document.querySelector("#search-bar").blur();
  };

  if (sessionUser) {
    sessionLinks = (
      <>
        <ProfileButton user={sessionUser} />
      </>
    );

    searchBar = (
      <form className="nav-search-bar" onSubmit={handleSearch}>
        {/* <i className="fas fa-search"></i> */}
        <ReactSVG src={searchIcon} wrapper="svg" id="search-icon" />
        <input
          id="search-bar"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <SignUpModal />
        <Button variant="dark" onClick={handleSubmit} disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Demo User"}
        </Button>
      </>
    );

    searchBar = <></>;
  }

  return (
    <Navbar bg="primary" variant="dark" className="nav-container">
      {searchBar}
      <Nav className="mr-auto1" id="nav-profile">
        {sessionLinks}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
