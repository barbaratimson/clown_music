import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlist = ({currentPlaylist,playlistData,setPlaylistData,currentSong, setCurrentSong,isplaying,setisplaying, setIsSongLoading,setCurrentPlaylist, audioElem, prevSong}) => {

    const handleSongClick = async (song) => {
        if (song.id === currentSong.id && isplaying){
            setisplaying(false)
        } else if (song.id !== currentSong.id) {
            setCurrentSong(song)
            setisplaying(true)
        } else {
            setisplaying(true)
        }
    }
    const fetchYaSongLink = async (id) => {
        setIsSongLoading(true)
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/tracks/${id}`,);
            return response.data
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
            if (err.code === "!-Error code here-!"){
                alert("!-Error code here-!")
            } else {
                alert("Server unavailable")
            }
          }
      };

    useEffect(()=>{
        if (isplaying){
            setisplaying(false)
        const handleTrackChange = async (song) => {
            let link = await fetchYaSongLink(song.id)
            if (!link){
                setCurrentSong(prevSong)
            } else {
                setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
            }
        }
        handleTrackChange(currentSong)
    }
    console.log(currentSong)
      },[currentSong.id])


    return (
        <div className='playlist-songs-list'>
            <div className='playlist-header'>
                Ваш плейлист
            </div>
            {currentPlaylist.map((song) => (
                 <div className={`playlist-song ${song.id === currentSong.id ? `song-current ${isplaying ? "" : "paused"}` : ""}`} key = {song.id} onClick={()=>{handleSongClick(song)}}>
                 <div className="play-button">
                    <div className='playlist-song-state'>{song.id !== currentSong.id ? "PLAY": `${isplaying ? "LISTENING" : "PAUSE"}`}</div>
                 </div>
                 <div className='playlist-song-title'>
                 {song.artists[0].name + " - " + song.title}
                 </div>
             </div>
            ))}
        
        </div>
    );

};

export default Playlist;