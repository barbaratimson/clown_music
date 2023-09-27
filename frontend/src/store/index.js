import { configureStore } from "@reduxjs/toolkit";
import changeCurrentSong from "./trackSlice";
import changeCurrentPlaylist from "./currentPlaylistSlice";
import addTrackToCurrentPlaylist from "./currentPlaylistSlice";
export default configureStore({
    reducer:{
        currentSong:changeCurrentSong,
        currentPlaylist:changeCurrentPlaylist,
    }
});