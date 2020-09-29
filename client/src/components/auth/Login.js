import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, sendGoogleToken } from '../../actions/auth';
import { GoogleLogin } from 'react-google-login';
//import axios from 'axios';

const Login = ({ login, auth, sendGoogleToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  //Redirect if logged in
  if (auth.isAuthenticated) {
    return <Redirect to='/dashboard'></Redirect>;
  }

  return (
    <div className='register'>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
        onSuccess={(response) => sendGoogleToken(response.tokenId)}
        onFailure={(response) => sendGoogleToken(response.tokenId)}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign in with Google
          </button>
        )}
      ></GoogleLogin>
      <p className='my-1'>
        <Link to='/forget'>Forgot your password?</Link>
      </p>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  sendGoogleToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login, sendGoogleToken })(Login);
