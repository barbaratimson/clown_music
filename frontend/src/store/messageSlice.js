import { createSlice } from "@reduxjs/toolkit"

const messageSlice = createSlice({
    name: 'message',
    initialState:{
        active:false,
        message: ""
    },
    reducers:{
        showMessage(state, action) {
            state.message = action.payload
            state.active = true
        },
        hideMessage(state, action) {
            state.message = ""
            state.active = false
        }
    }
})


export const { showMessage, hideMessage } = messageSlice.actions
export default messageSlice.reducer