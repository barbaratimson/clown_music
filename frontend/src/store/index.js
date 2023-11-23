import { configureStore } from "@reduxjs/toolkit";
import changeCurrentSong from "./trackSlice";
import changeCurrentPlaylist from "./currentPlaylistSlice";
import changeCurrentSongs  from "./currentSongsSlice";
import changeCurrentPage from "./currentPageSlice";
import changeLikedSongs from "./likedSongsSlice";
import changeModalState from "./modalSlice";
import changeIsPlaying from "./isSongPlaylingSlice";
import changeSongLoading from "./isSongLoadingSlice";
export default configureStore({
    reducer:{
        currentSong:changeCurrentSong,
        currentPlaylist:changeCurrentPlaylist,
        currentSongs:changeCurrentSongs,
        currentPage:changeCurrentPage,
        likedSongs:changeLikedSongs,
        modalActive:changeModalState,
        isplaying:changeIsPlaying,
        isSongLoading:changeSongLoading
    }
});