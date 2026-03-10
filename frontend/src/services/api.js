import axios from "axios";
import tokenHelper from "../utils/tokenHelper";
import { API_BASE_URL } from "../utils/constants";


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


api.interceptors.request.use(
    (config) => {
        const token = tokenHelper.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            tokenHelper.removeToken();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        if (status === 403) {
            console.warn("Accès refusé (403)");
        }

        if (status >= 500) {
            console.error("Erreur serveur :", error.response?.data);
        }

        return Promise.reject(error);
    }
);

export default api;