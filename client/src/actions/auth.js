import api from '../utils/api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import { setAlert } from './alert';

export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  const body = { name, email, password };
  try {
    const res = await api.post('/api/users', body);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    setAlert('Register successful', '-success');

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  const body = { email, password };
  try {
    const res = await api.post('/api/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    setAlert('Login successful', '-success');

    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, '-danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE
  });
  dispatch({
    type: LOGOUT
  });
};
