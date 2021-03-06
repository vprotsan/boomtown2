import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMember } from './memberAPI';

const initialState = {
    member: null,
    status: 'idle',
    error: null
};

export const getMemberAsync = createAsyncThunk(
    'member/fetchMember',
    async (url) => {
        const response = await fetchMember(url);
        return response;
    }
);

export const memberSlice = createSlice({
    name: 'member',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {},
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
      builder
        .addCase(getMemberAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getMemberAsync.rejected, (state) => {
          state.status = 'failed';
          state.error = "Sorry, There was an error retrieveing Member for this organization."
        })
        .addCase(getMemberAsync.fulfilled, (state, action) => {
          if(typeof action.payload === 'object' && action.payload !== null){
            state.status = 'successful';
            state.member = action.payload;
          } else {
            state.status = 'failed';
            state.error = "Sorry, there was an error getting user information."
          }
        });
    },
});

export const currentMember = (state) => state.member.member;
export const currentMemberStatus = (state) => state.member.status;
export const currentMemberError = (state) => state.member.error;

export default memberSlice.reducer;