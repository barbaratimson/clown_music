import { createSlice } from "@reduxjs/toolkit"


const playerFoldedSlice = createSlice({
    name: 'playerFolded',
    initialState:{
        playerFolded:false
    },
    reducers:{
        changePlayerFolded(state, action) {
            state.playerFolded = action.payload
        }
    }
})


export const { changePlayerFolded } = playerFoldedSlice.actions
export default playerFoldedSlice.reducer