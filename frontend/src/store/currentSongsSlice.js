import { createSlice,current } from "@reduxjs/toolkit"

const currentSongslice = createSlice({
    name: 'currentSongs',
    initialState:{
        currentSongs:[]
    },
    reducers:{
        changeCurrentSongs(state, action) {
            console.log(action)
            state.currentPlaylist = action.payload
        },
        addTrackToCurrentSongs(state,action) {
            state.currentPlaylist = {...state.currentPlaylist, tracks:[action.payload,...state.currentPlaylist.tracks]}
            console.log(action,current(state))
        },
        removeTrackFromCurrentSongs(state,action) {
            state.currentPlaylist.tracks = state.currentPlaylist.tracks.filter(track => track.id !== action.payload.id)
            console.log(action,current(state))
        },
        changeSongPosition(state,action){
            state.currentPlaylist.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
        }
    }
})


export const { changeCurrentSongs, addTrackToCurrentSongs, removeTrackFromCurrentSongs, changeSongPosition} = currentSongslice.actions
export default currentSongslice.reducer