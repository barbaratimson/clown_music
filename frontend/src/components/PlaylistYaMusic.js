import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlist = ({currentPlaylist,setCurrentPlaylist,currentSong, setCurrentSong,isplaying,setisplaying}) => {
    const handleSongClick = (song) => {
        if (song.title === currentSong.title && isplaying){
            setisplaying(false)
        } else {
            setCurrentSong(song)
            setisplaying(true)
        }
    }

    return (
        <div className='playlist-songs-list'>
            <div className='playlist-header'>
                Яндекс музыка
            </div>
            {currentPlaylist.length !== 0 ? (
                <div>
                    
            {currentPlaylist.map((song) => (
                 <div className={`playlist-song ${song.title === currentSong.title ? `song-current ${isplaying ? "" : "paused"}` : ""}`} key = {song.title} onClick={()=>{handleSongClick(song)}}>
                 <div className="play-button">
                    <div className='playlist-song-state'>{song.title !== currentSong.title ? "PLAY": `${isplaying ? "LISTENING" : "PAUSE"}`}</div>
                 </div>
                 <div className='playlist-song-title'>
                 {song.title}
                 </div>
             </div>
             
            ))}
            </div>
            ):
            (
                <h1>LOADING</h1>
            )
            }
        </div>
    );

};

export default Playlist;