import { configureStore } from "@reduxjs/toolkit";
import changeCurrentSong from "./trackSlice";
import changeCurrentPlaylist from "./currentPlaylistSlice";
import changeCurrentSongs  from "./currentSongsSlice";
import changeCurrentPage from "./currentPageSlice";
export default configureStore({
    reducer:{
        currentSong:changeCurrentSong,
        currentPlaylist:changeCurrentPlaylist,
        currentSongs:changeCurrentSongs,
        currentPage:changeCurrentPage
    }
});