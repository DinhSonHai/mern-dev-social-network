import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const Education = ({ education }) => (
  <div className="education">
    <h2 className="my-2">Education Credentials</h2>
    <table className="table">
      <thead>
        <tr>
          <th>School</th>
          <th className="hide-sm">Degree</th>
          <th className="hide-sm">Field of Study</th>
          <th className="hide-sm">Years</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {education.map((edu) => (
          <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">{edu.fieldofstudy}</td>
            <td>
              <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{' '}
              {edu.to === null ? (
                ' Now'
              ) : (
                <Moment format="YYYY/MM/DD">{edu.to}</Moment>
              )}
            </td>
            <td className="btn btn-danger">Delete</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Education.propTypes = {
  education: PropTypes.array.isRequired,
};

export default Education;
