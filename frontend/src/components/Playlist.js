import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlist = ({songs,currentSong, setCurrentSong}) => {

    const songFind = (song) => {
        if (song.title === currentSong.title){
        console.log("xio")
        }
    }

    

    return (
        <div className='playlist-songs-list'>
            {songs.map((song) => (
                 <div className={`playlist-song ${song.title === currentSong.title ? "song-current" : ""}`} key = {song.title} onClick={()=>{setCurrentSong(song)}}>
                 <div className="play-button" onClick={()=>songFind(song)}>
                    PLAY
                 </div>
                 {song.title}
             </div>
            ))}
        
        </div>
    );

};

export default Playlist;