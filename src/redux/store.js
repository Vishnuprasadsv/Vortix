import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import portfolioReducer from './slices/portfolioSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        market: marketReducer,
        portfolio: portfolioReducer,
    },
});
