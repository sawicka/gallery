import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

import "./Layout.css";

const layout = (props) => (
  <div className="Layout">
    <Navbar bg={"dark"} variant={"dark"} expand={"lg"}>
      <Navbar.Brand href={"/"} className={"navbar-brand logo"}>
        Gallery
      </Navbar.Brand>

      <Navbar.Toggle aria-controls={"basic-navbar-nav"} />

      <Navbar.Collapse id="basic-navbar-nav" className={"justify-content-end"}>
        {props.isLogged ? (
          <Nav>
            <Link className={"nav-link"} to="/">
              {" "}
              Lista{" "}
            </Link>
            <Link className={"nav-link"} to="/add/artwork">
              {" "}
              Dodaj dzieło{" "}
            </Link>
            <Link className={"nav-link"} to="/add/author">
              {" "}
              Dodaj autora{" "}
            </Link>
            <Nav.Link onClick={props.logout}>Wyloguj się</Nav.Link>
          </Nav>
        ) : (
          <Nav>
            <Link className={"nav-link"} to="/">
              Lista
            </Link>
            <Link className={"nav-link"} to="/login">
              Zaloguj się
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>

    <main>
      <div className={"container-fluid"}>{props.children}</div>
    </main>
    <footer></footer>
  </div>
);

export default layout;
