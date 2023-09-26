import { createSlice } from "@reduxjs/toolkit"

const currentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState:{
        currentPlaylist:[]
    },
    reducers:{
        changeCurrentPlaylist(state, action) {
            console.log(action)
            state.currentPlaylist = action.payload
        },
        addTrackToCurrentPlaylist(state,action) {
            console.log(action)
            state.currentPlaylist.push(action)
        },

        removeTrackFromCurrentPlaylist(state,action) {
            console.log(action)
            state.currentPlaylist = state.currentPlaylist.filter(track => track.id !== action.payload.id)
        },
        changeSongPosition(state,action){
            state.currentPlaylist.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
        }
    }
})


export const { changeCurrentPlaylist } = currentPlaylistSlice.actions
export default currentPlaylistSlice.reducer