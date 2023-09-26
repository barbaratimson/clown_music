import { configureStore } from "@reduxjs/toolkit";
import changeCurrentSong from "./trackSlice";
export default configureStore({
    reducer:{
        currentSong:changeCurrentSong,
    }
});