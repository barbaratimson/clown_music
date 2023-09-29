import { createSlice,current } from "@reduxjs/toolkit"

const likedSongsSlice = createSlice({
    name: 'likedSongs',
    initialState:{
        likedSongs:[]
    },
    reducers:{
        changeLikedSongs(state, action) {
            state.likedSongs = action.payload
        },
        addTrackToLikedSongs(state,action) {
            state.likedSongs = [action.payload,...state.likedSongs]
        },
        removeTrackFromLikedSongs(state,action) {
            state.likedSongs = state.likedSongs.filter(track => track.id !== action.payload.id)
        }
    }
})


export const { changeLikedSongs, addTrackToLikedSongs, removeTrackFromLikedSongs} = likedSongsSlice.actions
export default likedSongsSlice.reducer