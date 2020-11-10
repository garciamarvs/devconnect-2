import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_REPOS,
  GET_PROFILES,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from './types';

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: error.response.data.errors
    });
  }
};

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const res = await api.post('/api/profile', formData);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(
      setAlert(edit ? 'Profile Updated' : 'Profile Created', '-success')
    );

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const res = await api.put('/api/profile/experience', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    history.push('/dashboard');

    dispatch(setAlert('Experience Added', '-success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const res = await api.put('/api/profile/education', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    history.push('/dashboard');

    dispatch(setAlert('Education Added', '-success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', '-success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed', '-success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const deleteAccount = () => async (dispatch) => {
  if (
    window.confirm(
      'Are you sure you want to delete your account? This process cannot be undone.'
    )
  ) {
    try {
      await api.delete('/api/profile');

      dispatch({
        type: CLEAR_PROFILE
      });
      dispatch({
        type: ACCOUNT_DELETED
      });

      dispatch(setAlert('Acoount Deleted'));
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
      }
    }
  }
};

export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await api.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const getProfileById = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/api/profile/user/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};

export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await api.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }
  }
};
