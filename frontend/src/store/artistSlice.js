import { createSlice } from "@reduxjs/toolkit"


const artistSlice = createSlice({
    name: 'artist',
    initialState:{
        artist:''
    },
    reducers:{
        changeArtist(state, action) {
            state.artist = action.payload
        }
    }
})


export const { changeArtist } = artistSlice.actions
export default artistSlice.reducer