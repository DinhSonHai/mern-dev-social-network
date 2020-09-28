import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { reset } from '../../actions/auth';

const Reset = ({ match }) => {
  const [formData, setFormData] = useState({
    password: '',
    password1: '',
    token: '',
  });

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);

  const { password, password1 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password && password1 && password === password1) {
      reset(formData);
    } else {
      toast.error('Password do not match');
    }
  };
  return (
    <div className='reset'>
      <h1 className='large text-primary'>Reset password</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Reset Your Password
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password1'
            value={password1}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Save' />
      </form>
    </div>
  );
};

export default Reset;
