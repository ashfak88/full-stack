import axios from "axios";

let rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (rawUrl && !rawUrl.endsWith("/api")) {
    rawUrl = rawUrl.endsWith("/") ? `${rawUrl}api` : `${rawUrl}/api`;
}
export const API_BASE_URL = rawUrl;

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isLoginOrRefresh = originalRequest.url.includes("/users/login") || originalRequest.url.includes("/users/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginOrRefresh) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const user = JSON.parse(localStorage.getItem("loggedInUser"));
                if (!user?.refreshToken) {
                    throw new Error("No refresh token available");
                }

                const res = await axios.post(`${API_BASE_URL}/users/refresh`, {
                    refreshToken: user.refreshToken,
                });

                const { accessToken } = res.data;

                const updatedUser = { ...user, accessToken };
                localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.error("Session expired. Please login again.", refreshError);
                localStorage.removeItem("loggedInUser");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
