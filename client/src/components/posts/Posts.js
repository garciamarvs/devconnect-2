import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import PostForm from './PostForm';
import PostItem from './PostItem';

const Posts = ({ post: { posts, loading }, getPosts }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community!
      </p>

      <PostForm />

      <div className='posts'>
        {posts.length > 0 &&
          posts.map((post) => <PostItem key={post._id} post={post} />)}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
