import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "./reservations/ReservationForm";
import NotFound from "./NotFound";
import TableForm from "../tables/TableForm";
import ReservationSeatForm from "./reservations-seat/ReservationSeatForm";
import SearchForm from "./search/SearchForm";
import { today } from "../utils/date-time";
import ReservationEdit from "./reservations-edit/ReservationEdit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeatForm />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={`/dashboard?date=${today()}`} />
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact={true} path="/search">
        <SearchForm />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={`/dashboard?date=${today()}`} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
