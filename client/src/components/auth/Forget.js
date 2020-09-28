import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { setAlert } from '../../actions/alert';
import { forget } from '../../actions/auth';
//import axios from 'axios';

const Forget = ({ setAlert, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await forget({ email });
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard'></Redirect>;
  }

  return (
    <div className='register'>
      <h1 className='large text-primary'>Forget password</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Please
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            // required
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Send me email'
        />
      </form>
      <p className='my-1'>
        Remember your password? <Link to='/login'>Sign In</Link>
      </p>
    </div>
  );
};

Forget.propTypes = {
  setAlert: PropTypes.func.isRequired,
  // register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(Forget);
