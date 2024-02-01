import React from "react";

import { Link } from "react-router-dom";
import { today } from "../utils/date-time";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <header>
      <nav className="navbar navbar-fixed-top navbar-dark align-items-start p-0">
        <div className="container d-flex flex-row p-0">
          <Link
            className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
            to="/"
          >
            <div className="sidebar-brand-text mx-3">
              <span>Periodic Tables</span>
            </div>
          </Link>
          <hr className="sidebar-divider my-0" />
          <ul
            className="nav navbar-nav text-light flex-row align-items-center justify-conetent-center p-3"
            id="accordionSidebar"
          >
            <li className="nav-item p-2">
              <Link className="nav-link" to={`/dashboard?date=${today()}`}>
                <span className="oi oi-dashboard" />
                &nbsp;Dashboard
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/search">
                <span className="oi oi-magnifying-glass" />
                &nbsp;Search
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/reservations/new">
                <span className="oi oi-plus" />
                &nbsp;New Reservation
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/tables/new">
                <span className="oi oi-layers" />
                &nbsp;New Table
              </Link>
            </li>
          </ul>
          <div className="text-center d-none d-md-inline">
            <button
              className="btn rounded-circle border-0"
              id="sidebarToggle"
              type="button"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Menu;
