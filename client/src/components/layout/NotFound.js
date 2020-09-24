import React from 'react';
import PropTypes from 'prop-types';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle"></i> Page not found
      </h1>
      <p className="large">Sorry, this page does not exist</p>
    </div>
  );
};

NotFound.propTypes = {};

export default NotFound;
