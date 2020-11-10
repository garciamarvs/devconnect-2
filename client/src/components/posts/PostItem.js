import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { likePost, unlikePost, deletePost } from '../../actions/post';
import { connect } from 'react-redux';

const PostItem = ({
  post: { _id, user, name, avatar, text, createdAt, likes, comments },
  auth,
  likePost,
  unlikePost,
  deletePost
}) => {
  let isLiked = false;

  if (!auth.loading) {
    isLiked = likes.find((like) => like.user === auth.user._id);
  }

  return (
    !auth.loading && (
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
            Posted on <Moment format='MM/DD/YYYY'>{createdAt}</Moment>
          </p>
          <button
            type='button'
            className={isLiked ? `btn btn-primary` : `btn btn-light`}
            onClick={() => (isLiked ? unlikePost(_id) : likePost(_id))}
          >
            <i className='fas fa-thumbs-up'></i>
            <span>{` ${likes.length}`}</span>
          </button>
          <Link to={`/posts/${_id}`} className='btn btn-primary'>
            Discussion <span className='comment-count'>{comments.length}</span>
          </Link>
          {auth && auth.user._id === user && (
            <button
              type='button'
              className='btn btn-danger'
              onClick={() => deletePost(_id)}
            >
              <i className='fas fa-times'></i>
            </button>
          )}
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { likePost, unlikePost, deletePost })(
  PostItem
);
