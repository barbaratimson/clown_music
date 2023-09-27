import { createSlice,current } from "@reduxjs/toolkit"

const currentSongslice = createSlice({
    name: 'currentSongs',
    initialState:{
        currentSongs:[]
    },
    reducers:{
        changeCurrentSongs(state, action) {
            state.currentSongs = action.payload
        },
        addTrackToCurrentSongs(state,action) {
            state.currentSongs = [action.payload,...state.currentSongs]
        },
        removeTrackFromCurrentSongs(state,action) {
            state.currentSongs = state.currentSongs.filter(track => track.id !== action.payload.id)
        },
        changeSongPosition(state,action){
            state.currentSongs.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
            console.log(action,current(state))
        }
    }
})


export const { changeCurrentSongs, addTrackToCurrentSongs, removeTrackFromCurrentSongs, changeSongPosition} = currentSongslice.actions
export default currentSongslice.reducer