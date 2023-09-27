import { createSlice,current } from "@reduxjs/toolkit"

const prevPlaylist = JSON.parse(localStorage.getItem("prevPlaylist"))  

const currentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState:{
        currentPlaylist:prevPlaylist ? prevPlaylist : {title:""}
    },
    reducers:{
        changeCurrentPlaylist(state, action) {
            console.log(action)
            state.currentPlaylist = action.payload
        }
    }
})


export const { changeCurrentPlaylist} = currentPlaylistSlice.actions
export default currentPlaylistSlice.reducer