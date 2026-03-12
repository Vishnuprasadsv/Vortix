import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '') + '/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const registerAPI = async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
};

export const loginAPI = async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
};

export const checkUsernameAPI = async (username) => {
    const response = await apiClient.get(`/check-username/${username}`);
    return response.data;
};

export const getProfileAPI = async () => {
    const response = await apiClient.get('/profile');
    return response.data;
};

export const updateProfileAPI = async (profileData) => {
    const response = await apiClient.put('/profile', profileData);
    return response.data;
};

export const updatePasswordAPI = async (passwordData) => {
    const response = await apiClient.put('/profile/password', passwordData);
    return response.data;
};

export const uploadAvatarAPI = async (formData) => {
    const response = await apiClient.post('/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getPortfolioAPI = async () => {
    const response = await apiClient.get('/portfolio');
    return response.data;
};

export const updatePortfolioAPI = async (portfolioData) => {
    const response = await apiClient.put('/portfolio', portfolioData);
    return response.data;
};

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

export const fetchMarkets = async () => {
    try {
        const response = await axios.get(COINGECKO_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching market data from CoinGecko:", error);
        throw error;
    }
};
