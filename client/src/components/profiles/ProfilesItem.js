import React from 'react';
import { Link } from 'react-router-dom';

const ProfilesItem = ({
  profile: {
    status,
    company,
    location,
    skills,
    user: { _id, name, avatar }
  }
}) => {
  return (
    <div className='profile bg-light'>
      <img className='round-img' src={avatar} alt='' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && ` at ${company}`}
        </p>
        <p>{location}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>

      <ul>
        {skills.map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check'></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilesItem;
