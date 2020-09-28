import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { activate } from '../../actions/auth';

const Activate = ({ history, match }) => {
  const [formData, setFormData] = useState({
    token: '',
  });

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);

  const { token } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    activate(formData, history);
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          type="submit"
          className="btn btn-primary"
          value="Activate your account"
        />
      </form>
    </div>
  );
};

Activate.propTypes = {};

export default Activate;
