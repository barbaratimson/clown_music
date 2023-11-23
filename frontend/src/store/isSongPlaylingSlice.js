import { createSlice } from "@reduxjs/toolkit"

const isPlayingSlice = createSlice({
    name: 'isplaying',
    initialState:{
        isplaying: false
    },
    reducers:{
        changeIsPlaying(state, action) {
            state.isplaying = action.payload
        },
    }
})


export const { changeIsPlaying } = isPlayingSlice.actions
export default isPlayingSlice.reducer