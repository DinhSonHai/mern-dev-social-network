import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile/CreateProfile';
import EditProfile from '../profile/EditProfile';
import AddExperience from '../profile/AddExperience';
import AddEducation from '../profile/AddEducation';
import Profiles from '../profile/Profiles';
import Profile from '../profile/Profile';
import Post from '../post/Post';
import Posts from '../posts/Posts';

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create/profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit/profile" component={EditProfile} />
        <PrivateRoute exact path="/add/experience" component={AddExperience} />
        <PrivateRoute exact path="/add/education" component={AddEducation} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

Routes.propTypes = {};

export default Routes;
