import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/post';
import PropTypes from 'prop-types';

const PostComment = ({
  auth,
  post,
  comment: { _id, user, avatar, name, text, date },
  deleteComment
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='MMMM/DD/YYYY'>{date}</Moment>
        </p>
        {!auth.loading && auth.isAuthenticated && auth.user._id === user && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={() => deleteComment(post, _id)}
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostComment.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(PostComment);
