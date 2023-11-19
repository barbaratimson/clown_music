import React, { useEffect,useState,useRef } from 'react';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill, BsThreeDotsVertical } from 'react-icons/bs';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { addTrackToCurrentSongs, removeTrackFromCurrentSongs } from '../store/currentSongsSlice';
import { changeCurrentPage } from '../store/currentPageSlice';
import { addTrackToLikedSongs, removeTrackFromLikedSongs } from '../store/likedSongsSlice';
import { changeModalState } from '../store/modalSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({setArtist, children, setPlayerFolded, audioElem, playlist,setPrevSong, song, isplaying,isSongLoading}) => {

  const [likeButtonHover,setLikeButtonHover] = useState(false)
  const [artistHover,setArtistHover] = useState(false)

  const likedSongs = useSelector(state => state.likedSongs.likedSongs)   
  const removeTrackFromSongs = (song) => dispatch(removeTrackFromCurrentSongs(song))
  const removeTrackFromLiked = (song) => dispatch(removeTrackFromLikedSongs(song))
  const addTrackToLiked = (song) => dispatch(addTrackToLikedSongs(song))
  const addTrackToSongs = (song) => dispatch(addTrackToCurrentSongs(song))
  const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
  const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
  const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))
  const currentSong = useSelector(state => state.currentSong.currentSong) 
  const dispatch = useDispatch();
  const setCurrentSong = (song) => dispatch(changeCurrentSong(song))
  const setActive = (state) => dispatch(changeModalState(state))

    const handleSongClick = async (song) => {
      console.log(song)
        if (String(song.id) === String(currentSong.id) && isplaying){
            audioElem.current.pause()
        } else if (String(song.id) !== String(currentSong.id)) {
          if (playlist && currentPlaylist.playlistUuid !== playlist.playlistUuid) {
          setCurrentPlaylist(playlist)
          setActive(false)
          }
          audioElem.current.currentTime = 0
          setPrevSong(currentSong)
          audioElem.current.src = ' '
            setCurrentSong(song)
        } else{
            audioElem.current.play().catch(err=>console.error(err))
      }
    }

    
  const likeSong = async (song) => {
    try {
      const response = await axios.post(
        `${link}/ya/likeTracks/${song.id}`,null,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        handleLikeSong(song)
        console.log("Track" ,song.title, "added to Liked." ," Revision: ",response.data)
        return response.data
    } catch (err) {
      console.error('Ошибка при получении списка треков:', err);
      console.log(err)
    }
};

const dislikeSong = async (song) => {
  try {
    const response = await axios.post(
      `${link}/ya/dislikeTracks/${song.id}`,null,{headers:{"Authorization":localStorage.getItem("Authorization")}});
      console.log("Track" ,song.title, "removed from Liked." ," Revision: ",response.data)
      handleRemoveSong(song)
    return response.data
  } catch (err) {
    console.error('Ошибка при получении списка треков:', err);
    console.log(err)
  }
};


    function millisToMinutesAndSeconds(millis) {
      if (millis){
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      } else {
        return '-:-'
      }
    }

    const handleRemoveSong = (song) =>  {
      removeTrackFromLiked(song)
      if (currentPlaylist.kind === 3) {
       removeTrackFromSongs(song)
      }
    }

    const handleLikeSong = (song) =>  {
      addTrackToLiked(song)
      if (currentPlaylist.kind === 3) {
        addTrackToSongs(song)
      }
    }

    return (
              <div className={`playlist-song ${String(song.id) === String(currentSong.id) ? `song-current ${isplaying ? "" : "paused"}` : ""}`} key = {song.id} onClick={()=>{song.available && !isSongLoading && !likeButtonHover && !artistHover ? handleSongClick(song) : console.log()}}>
                 <div className="play-button">
                    <div className='playlist-song-state'>{String(song.id) !== String(currentSong.id) ? <div id = "play"><BsPlayFill/></div>: isplaying ? <div id="listening"><BsMusicNote/></div> : <div id = "pause"><BsFillPauseFill/></div>}</div>
                 </div>
                 <div className='playlist-song-image'>      
                 <img src={song.ogImage ? `http://${song.ogImage.substring(0, song.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                 </div>
                 <div className='playlist-song-title'>
                  <div className='playlist-song-title-title'>{song.title}</div>
                  
                  <div className='player-track-artists'>
        {song.artists ? song.artists.map(artist=>(
           <div className='playlist-song-title-artist' key={artist.name} onClick={()=>{setArtist(artist.name);setCurrentPage("artists");setPlayerFolded(true);setActive(false)}}  onMouseEnter={()=>{setArtistHover(true)}} onMouseLeave={()=>{setArtistHover(false)}}>{artist.name}</div>
        )):null}
                </div>
                  {children}
                 </div>
                 <div className='playlist-song-actions'>
                  {!likedSongs.find((elem) => String(elem.id) === String(song.id)) ? (
                  <div className='playlist-song-like-button' onMouseEnter={()=>{setLikeButtonHover(true)}} onMouseLeave={()=>{setLikeButtonHover(false)}} onClick={()=>{likeSong(song)}}><RiHeartLine/></div>
                  ): (
                    <div className='playlist-song-like-button' onMouseEnter={()=>{setLikeButtonHover(true)}} onMouseLeave={()=>{setLikeButtonHover(false)}} onClick={()=>{dislikeSong(song)}}><RiHeartFill/></div>
                  )
                  }
                 </div>
                 <div className='playlist-song-duration'>
                    {millisToMinutesAndSeconds(song.durationMs)}
                 </div>
                 <div className='playlist-song-menu-dots'>
                  <BsThreeDotsVertical/>
                  </div>
             </div>
        
    );

};

export default Track;