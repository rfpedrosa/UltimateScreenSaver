import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import NewPlaylist from "./containers/playlists/NewPlaylist";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Signup from "./containers/Signup";
import NewRecipe from "./containers/recipe/NewRecipe";
import EditRecipe from "./containers/recipe/EditRecipe";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/recipes/new" exact component={NewRecipe} props={childProps} />
    <AuthenticatedRoute path="/recipes/:id" exact component={EditRecipe} props={childProps} />
    <AuthenticatedRoute path="/recipes/:id/play" exact component={NewPlaylist} props={childProps} />
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;
