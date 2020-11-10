import {
  GET_POSTS,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST,
  POST_ERROR
} from './types';
import { setAlert } from './alert';
import api from '../utils/api';

export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: [
        { msg: error.response.statusText, status: error.response.status }
      ]
    });
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/api/posts/${id}/like`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const unlikePost = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/api/posts/${id}/unlike`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const addPost = (text) => async (dispatch) => {
  try {
    const res = await api.post('/api/posts', text);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', '-success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const deletePost = (id) => async (dispatch) => {
  if (window.confirm('Do you want to delete this post?')) {
    try {
      await api.delete(`/api/posts/${id}`);

      dispatch({
        type: DELETE_POST,
        payload: id
      });

      dispatch(setAlert('Post Deleted', '-success'));
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
      }
    }
  }
};
