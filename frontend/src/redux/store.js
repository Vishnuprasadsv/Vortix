import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import portfolioReducer from './slices/portfolioSlice';
// Load previously saved portfolio state from LocalStorage to persist user data
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('vortix_portfolio');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};
// Save current state down to LocalStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('vortix_portfolio', serializedState);
    } catch {
    }
};

const preloadedPortfolio = loadState();
// Configure and initialize the Redux store with slices
export const store = configureStore({
    reducer: {
        auth: authReducer,           
        market: marketReducer,        
        portfolio: portfolioReducer,  
    },
    preloadedState: {
        portfolio: preloadedPortfolio
    }
});
// Subscribe to store updates to automatically save the portfolio state
store.subscribe(() => {
    const state = store.getState();
    if (state.portfolio) {
        saveState(state.portfolio);
    }
});
