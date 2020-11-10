import React from 'react';
import Moment from 'react-moment';

const ProfileExperience = ({ experience }) => {
  return (
    <div className='profile-exp bg-white p-2'>
      <h2 className='text-primary'>Experience</h2>
      {experience.length > 0
        ? experience.map((exp) => (
            <div key={exp._id}>
              <h3 className='text-dark'>{exp.company}</h3>
              <p>
                <Moment format='MMM YYYY'>{exp.from}</Moment> -{' '}
                {exp.current ? (
                  'Current'
                ) : (
                  <Moment format='MMM YYYY'>{exp.to}</Moment>
                )}
              </p>
              <p>
                <strong>Position: </strong>
                {exp.title}
              </p>
              <p>
                <strong>Description: </strong>
                {exp.description}
              </p>
            </div>
          ))
        : 'No experience yet.'}
    </div>
  );
};

export default ProfileExperience;
