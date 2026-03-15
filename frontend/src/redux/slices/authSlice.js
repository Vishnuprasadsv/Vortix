import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,       
    loading: false,   
    error: null,      
};
// Redux slice to manage user authentication state, loading status, and errors
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

export default authSlice.reducer;
