import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const Experience = ({ experience }) => (
  <div className="experience">
    <h2 className="my-2">Experience Credentials</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th className="hide-sm">Title</th>
          <th className="hide-sm">Years</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {experience.map((exp) => (
          <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
              <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{' '}
              {exp.to === null ? (
                ' Now'
              ) : (
                <Moment format="YYYY/MM/DD">{exp.to}</Moment>
              )}
            </td>
            <td className="btn btn-danger">Delete</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default Experience;
