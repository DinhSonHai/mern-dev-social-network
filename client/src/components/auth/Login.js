import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  login,
  sendFacebookToken,
  sendGoogleToken,
  facebookLogin,
} from '../../actions/auth';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
//import axios from 'axios';

const Login = ({ login, auth, sendGoogleToken, facebookLogin }) => {
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
  if (auth.isAuthenticated && auth.user !== null) {
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
        cookiePolicy={'single_host_origin'}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign in with Google
          </button>
        )}
      ></GoogleLogin>
      <br />
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT}
        autoLoad={false}
        callback={async (response) => {
          const data = await sendFacebookToken(
            response.userID,
            response.accessToken
          );
          facebookLogin(data);
        }}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign in with facebook
          </button>
        )}
      ></FacebookLogin>
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
  facebookLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  login,
  sendGoogleToken,
  facebookLogin,
})(Login);
