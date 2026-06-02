import { createSlice } from '@reduxjs/toolkit';

const getIsAuthenticatedFromCookie = () => {
    if (typeof document === 'undefined') {
        return false;
    }

    const authCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('isAuthenticated='));

    if (!authCookie) {
        return false;
    }

    const cookieValue = authCookie.split('=')[1];
    return cookieValue === 'true';
};

const initialState = {
    isAuthenticated: getIsAuthenticatedFromCookie(),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        syncAuthFromCookie: (state) => {
            state.isAuthenticated = getIsAuthenticatedFromCookie();
        },
    },
});

export const { setAuthenticated, syncAuthFromCookie, setUser } = authSlice.actions;
export default authSlice.reducer;
