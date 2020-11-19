import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPostById } from '../../actions/post';
import { connect } from 'react-redux';
import PostComment from './PostComment';
import PostCommentForm from './PostCommentForm';
import Spinner from '../layouts/Spinner';
import PropTypes from 'prop-types';

const Post = ({ post: { post, loading }, match, getPostById }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById, match.params.id]);

  return post == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${post.user}`}>
            <img className='round-img' src={post.avatar} alt='' />
            <h4>{post.name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{post.text}</p>
        </div>
      </div>

      <PostCommentForm post_id={match.params.id} />

      <div className='comments'>
        {post.comments.map((comment) => (
          <PostComment key={comment._id} comment={comment} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPostById })(Post);
