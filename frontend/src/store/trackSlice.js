import { createSlice } from "@reduxjs/toolkit"

const savedSong = JSON.parse(localStorage.getItem("lastPlayedTrack"))  

const trackSlice = createSlice({
    name: 'currentSong',
    initialState:{
        currentSong: savedSong ? savedSong : {title:"",url:"",artists:[{name:""}]}
    },
    reducers:{
        changeCurrentSong(state, action) {
            state.currentSong = action.payload
        },
    }
})


export const { changeCurrentSong } = trackSlice.actions
export default trackSlice.reducer