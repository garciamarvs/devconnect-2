import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Alert from '../layouts/Alert';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import PrivateRoute from '../routing/PrivateRoute';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layouts/NotFound';

const Routes = () => {
  return (
    <section className='container'>
      <Alert></Alert>
      <Switch>
        <Route exact path='/register' component={Register}></Route>
        <Route exact path='/login' component={Login}></Route>
        <Route exact path='/profiles' component={Profiles}></Route>
        <Route exact path='/profile/:id' component={Profile}></Route>
        <PrivateRoute
          exact
          path='/dashboard'
          component={Dashboard}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/profile'
          component={ProfileForm}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/add-experience'
          component={AddExperience}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path='/add-education'
          component={AddEducation}
        ></PrivateRoute>
        <PrivateRoute exact path='/posts' component={Posts}></PrivateRoute>
        <PrivateRoute exact path='/posts/:id' component={Post}></PrivateRoute>
        <Route component={NotFound}></Route>
      </Switch>
    </section>
  );
};

export default Routes;
