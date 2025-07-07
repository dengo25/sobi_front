import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    id: null,
    memberId: null,
    memberName: null,
    memberEmail: null,
    memberGender: null,
    memberBirth: null,
    memberAddr: null,
    memberZip: null,
    role: null
};

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        login: (state, action) => {
            return { ...state, ...action.payload };
        },
        logout: (state) => {
            localStorage.removeItem("ACCESS_TOKEN");
            return initialState;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        }
    }
});

export const { login, logout, setToken } = memberSlice.actions;

export default memberSlice.reducer;
