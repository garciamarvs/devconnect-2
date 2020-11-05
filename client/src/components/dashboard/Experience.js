import React, { Fragment } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td className='hide-sm'>
        <Moment format='MM-DD-YYYY'>{exp.from}</Moment>
        {' - '}
        {exp.to == null ? 'Now' : <Moment format='MM-DD-YYYY'>{exp.to}</Moment>}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteExperience(exp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array,
  deleteExperience: PropTypes.func
};

const mapStateToProps = (state) => ({
  experience: state.profile.profile.experience
});

export default connect(mapStateToProps, { deleteExperience })(Experience);
