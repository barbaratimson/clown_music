import { createSlice } from "@reduxjs/toolkit"

const modalSlice = createSlice({
    name: 'modalActive',
    initialState:{
        modalActive: false
    },
    reducers:{
        changeModalState(state, action) {
            state.modalActive = action.payload
        },
    }
})


export const { changeModalState } = modalSlice.actions
export default modalSlice.reducer