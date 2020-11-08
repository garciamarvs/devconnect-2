import React from 'react';
import Moment from 'react-moment';

const ProfileEducation = ({ education }) => {
  return (
    <div className='profile-edu bg-white p-2'>
      <h2 className='text-primary'>Education</h2>
      {education.length > 0
        ? education.map((edu) => (
            <div key={edu._id}>
              <h3>{edu.school}</h3>
              <p>
                <Moment format='MMM YYYY'>{edu.from}</Moment> -{' '}
                {edu.current ? (
                  'Current'
                ) : (
                  <Moment format='MMM YYYY'>{edu.to}</Moment>
                )}
              </p>
              <p>
                <strong>Degree: </strong>
                {edu.degree}
              </p>
              <p>
                <strong>Field Of Study: </strong>
                {edu.fieldofstudy}
              </p>
              <p>
                <strong>Description: </strong>
                {edu.description}
              </p>
            </div>
          ))
        : 'No experience yet.'}
    </div>
  );
};

export default ProfileEducation;
