import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/'
});
axiosInstance.defaults.timeout = 10000000;
export async function getBaseUrl() {
    return await 'http://localhost:5000/api/';
}
axiosInstance.interceptors.request.use(async config => { config.baseURL = await getBaseUrl(); return config; }, error => Promise.reject(error))
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
export default axiosInstance;