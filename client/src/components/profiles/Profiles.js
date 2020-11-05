import React, { Fragment, useEffect } from 'react';
import ProfilesItem from './ProfilesItem';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import PropTypes from 'prop-types';

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Developers</h1>
      <p className='lead'>
        <i className='fab fa-connectdevelop'></i> Browse and connect with
        developers
      </p>
      <div className='profiles'>
        {profiles.map((profile) => (
          <ProfilesItem key={profile._id} profile={profile} />
        ))}
      </div>
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
