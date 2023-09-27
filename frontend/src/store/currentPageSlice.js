import { createSlice } from "@reduxjs/toolkit"


const currentPageSlice = createSlice({
    name: 'currentPage',
    initialState:{
        currentPage:"currentPlaylist"
    },
    reducers:{
        changeCurrentPage(state, action) {
            state.currentPage = action.payload
        }
    }
})


export const { changeCurrentPage} = currentPageSlice.actions
export default currentPageSlice.reducer