import axiosClient from './axios-client';

export const signup = async (data: {
  email: string;
  firstName: string;
  password: string;
  mobile: string;
  address: string;
}) => {
  try {
    const response = await axiosClient.post('/auth/signup/user', data);
    return response;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosClient.post('/auth/login/user', data);
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosClient.post('/auth/reset-password', { token, newPassword });
    return response;
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};