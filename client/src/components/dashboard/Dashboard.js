import React, { Fragment, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Experience from './Experience';
import Spinner from '../layout/Spinner';
import Education from './Education';

const Dashboard = ({
  auth: { user },
  profile: { profile, loading },
  getCurrentProfile,
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return loading && profile === null ? (
    <Spinner />
  ) : user.role === 'admin' ? (
    <Redirect to='/admin'></Redirect>
  ) : (
    <div className='dashboard'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'> Welcome {user && user.name}</i>
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='dash-buttons'>
            <Link to='/edit/profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary'></i> Edit Profile
            </Link>
            <Link to='/add/experience' className='btn btn-light'>
              <i className='fab fa-black-tie text-primary'></i> Add Experience
            </Link>
            <Link to='/add/education' className='btn btn-light'>
              <i className='fas fa-graduation-cap text-primary'></i> Add
              Education
            </Link>
          </div>
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'></i>
              Delete my account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup profile, please add some</p>
          <Link to='/create/profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
