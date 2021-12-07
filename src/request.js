import axios from 'axios';

export default axios.create({
  baseURL: 'https://799c-135-180-49-65.ngrok.io/api',
  timeout: 10000,
});
