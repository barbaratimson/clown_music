import { createSlice } from "@reduxjs/toolkit"

const isSongLoading = createSlice({
    name: 'isSongLoading',
    initialState:{
        isSongLoading: false
    },
    reducers:{
        changeSongLoading(state, action) {
            state.isSongLoading = action.payload
        },
    }
})


export const { changeSongLoading } = isSongLoading.actions
export default isSongLoading.reducer