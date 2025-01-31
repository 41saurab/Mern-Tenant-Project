import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 50000,
    timeoutErrorMessage: "Service timed out",
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (success) => {
        return success.data;
    },
    async (error) => {
        throw error.response;
    }
);

export default axiosInstance;
