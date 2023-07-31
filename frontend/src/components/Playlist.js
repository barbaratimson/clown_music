import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlist = ({songs,currentSong, setCurrentSong,setisplaying}) => {


    const songFind = (song) => {
        if (song.title === currentSong.title){
        console.log("xio")
        }
    }

    

    return (
        <div className='playlist-songs-list'>
            {songs.map((song) => (
                 <div className={`playlist-song ${song.title === currentSong.title ? "song-current" : ""}`} key = {song.title} onClick={()=>{setCurrentSong(song);setisplaying(true)}}>
                 <div className="play-button"  onClick={(e)=>{songFind(song);}}>
                    {song.title === currentSong.title ? "LISTENING:" : "PLAY:"}
                 </div>
                 {song.title}
             </div>
            ))}
        
        </div>
    );

};

export default Playlist;