import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
})

const followStatus = createSlice({
    name: 'follow',
    initialState: {
        follow: false,
    },
    reducers: {
        setFollowStatus: (state, action) => {
            state.follow = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export const { setFollowStatus } = followStatus.actions;

export const store = configureStore({
    reducer: combineReducers({
        user: userSlice.reducer,
        follow: followStatus.reducer,
    })
})