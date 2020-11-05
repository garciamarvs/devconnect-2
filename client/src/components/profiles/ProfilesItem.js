import React from 'react';

const ProfilesItem = ({
  profile: {
    status,
    company,
    location,
    skills,
    user: { name, avatar }
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
        <a href='profile.html' className='btn btn-primary'>
          View Profile
        </a>
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
