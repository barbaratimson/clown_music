import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri';

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({currentPlaylist,setArtist, setCurrentPage,setPlayerFolded, audioElem,setCurrentPlaylist, playlist,setPrevSong, song, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {
  const [likeButtonHover,setLikeButtonHover] = useState(false)
  const [artistHover,setArtistHover] = useState(false)
    const handleSongClick = async (song) => {
        if (String(song.id) === String(currentSong.id) && isplaying){
            audioElem.current.pause()
        } else if (String(song.id) !== String(currentSong.id)) {
          if (playlist && currentPlaylist.playlistUuid !== playlist.playlistUuid) {
          setCurrentPlaylist(playlist)
          }
          audioElem.current.currentTime = 0
          currentSong.progress = 0
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
        `${link}/ya/likeTracks/${267472538}/${song.id}`,);
        return response.data
    } catch (err) {
      console.error('Ошибка при получении списка треков:', err);
      console.log(err)
    }
};

const dislikeSong = async (song) => {
  try {
    const response = await axios.post(
      `${link}/ya/dislikeTracks/${267472538}/${song.id}`,);
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
      setLikedSongs(prev => {
        const newSongs = prev.filter(e => e.id !== song.id);
        return newSongs
      })
      if (currentPlaylist.kind === 3) {
        setCurrentSongs(prev => {
          const newSongs = prev.filter(e => e.id !== song.id);
          return newSongs
        })
      }
    }

    const handleLikeSong = (song) =>  {
      setLikedSongs(prev => [song,...prev])
      if (currentPlaylist.kind === 3) {
        setCurrentSongs(prev => [song,...prev])
      }
    }

    return (
              <div className={`playlist-song ${String(song.id) === String(currentSong.id) ? `song-current ${isplaying ? "" : "paused"}` : ""}`} style={{opacity:`${song.available ? "1" : "0.8"}`}} key = {song.id} onClick={()=>{song.available && !isSongLoading && !likeButtonHover && !artistHover ? handleSongClick(song) : console.log()}}>
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
           <div className='playlist-song-title-artist' onClick={()=>{setArtist(artist.name);setCurrentPage("artists");setPlayerFolded(true)}}  onMouseEnter={()=>{setArtistHover(true)}} onMouseLeave={()=>{setArtistHover(false)}}>{artist.name}</div>
        )):(null)}
                </div>
                  {/* <div className='playlist-song-title-artist' onClick={()=>{setArtist(song.artists[0].name)}} onMouseEnter={()=>{setArtistHover(true)}} onMouseLeave={()=>{setArtistHover(false)}}>{song.artists && song.artists.length !== 0 ? song.artists[0].name : ""}</div> */}
                 </div>
                 <div className='playlist-song-actions'>
                  {!likedSongs.find((elem) => String(elem.id) === String(song.id)) ? (
                  <div className='playlist-song-like-button' onMouseEnter={()=>{setLikeButtonHover(true)}} onMouseLeave={()=>{setLikeButtonHover(false)}} onClick={()=>{likeSong(song);handleLikeSong(song)}}><RiHeartLine/></div>
                  ): (
                    <div className='playlist-song-like-button' onMouseEnter={()=>{setLikeButtonHover(true)}} onMouseLeave={()=>{setLikeButtonHover(false)}} onClick={()=>{dislikeSong(song);handleRemoveSong(song)}}><RiHeartFill/></div>
                  )
                  }
                 </div>
                 <div className='playlist-song-duration'>
                    {millisToMinutesAndSeconds(song.durationMs)}
                 </div>
             </div>
        
    );

};

export default Track;