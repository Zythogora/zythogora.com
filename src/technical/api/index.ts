import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  validateStatus: (status) => status < 500,
});
