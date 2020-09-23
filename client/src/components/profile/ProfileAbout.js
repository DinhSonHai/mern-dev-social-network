import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => {
  const arrName = name.trim().split(' ');
  const lastName = arrName[arrName.length - 1];
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">{lastName}'s Bio</h2>
          <p>{bio}</p>
          <div className="line"></div>
        </Fragment>
      )}
      <h2 className="text-primary">Skill Set</h2>
      <div className="skills">
        {skills.map((skill, index) => (
          <div key={index} className="p-1">
            <i className="fa fa-check"></i> {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;