import axios from 'axios';
import { toast } from 'react-toastify';

// import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register
export const register = async ({ name, email, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
    toast.success(res.data.message);
    // dispatch({
    //   type: REGISTER_SUCCESS,
    //   payload: res.data,
    // });
    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      // errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      errors.forEach((error) => toast.error(error.msg));
    }
    // dispatch({
    //   type: REGISTER_FAIL,
    // });
  }
};

//Login
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      // errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      errors.forEach((error) => toast.error(error.msg));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

//*========================================================================*\\
//Activate
export const activate = async ({ token: tokenActivate }, history) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ tokenActivate });

  try {
    const res = await axios.post('/api/users/activation', body, config);
    toast.success(res.data.msg);
    history.push('/login');
    // dispatch({
    //   type: REGISTER_SUCCESS,
    //   payload: res.data,
    // });
    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      // errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      errors.forEach((error) => toast.error(error.msg));
    }
    const tokenError = err.response.data.msg;
    if (tokenError) {
      toast.error(tokenError);
    }
    // dispatch({
    //   type: REGISTER_FAIL,
    // });
  }
};

//Forget password
export const forget = async ({ email }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post('/api/users/forget', body, config);
    toast.success(res.data.msg);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

//Reset password
export const reset = async ({ password, token: resetPasswordLink }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ password, resetPasswordLink });

  try {
    const res = await axios.post('/api/users/reset', body, config);
    toast.success(res.data.msg);
  } catch (err) {
    const tokenError = err.response.data.msg;
    if (tokenError) {
      toast.error(tokenError);
    }
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }
  }
};

export const sendGoogleToken = (tokenId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ idToken: tokenId });
  try {
    const res = await axios.post('/api/users/googlelogin', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    // history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    // toast.error(err.response.data.msg);
  }
};

export const sendFacebookToken = async (userID, accessToken) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ userID, accessToken });
  try {
    const res = await axios.post('/api/users/facebooklogin', body, config);
    return res.data;
    // dispatch({
    //   type: LOGIN_SUCCESS,
    //   payload: res.data,
    // });
    // dispatch(loadUser());
    // history.push('/dashboard');
  } catch (err) {
    console.log(err.response.err);
    // dispatch({
    //   type: LOGIN_FAIL,
    // });
    // toast.error(err.response.data.msg);
  }
};

export const facebookLogin = (data) => async (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: data,
  });
  dispatch(loadUser());
};
