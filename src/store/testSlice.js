import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: 'Sample Test',
    type: 'practice',
    subject: '',
    topics: [],
    sub_topics: [],
    correct_marks: 4,
    wrong_marks: -1,
    unattempt_marks: 0,
    difficulty: '',
    total_time: 60,
    total_marks: 250,
    total_questions: 50,
    status: 'draft',
};

//Status: live, unpublished, scheduled, expired, draft

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setTests: (state, action) => {
            return { ...state, ...action.payload };
        },
        syncAuthFromCookie: (state) => {
            state.isAuthenticated = getIsAuthenticatedFromCookie();
        },
    },
});

export const { setTests } = testSlice.actions;
export default testSlice.reducer;
