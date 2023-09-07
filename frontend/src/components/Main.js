import React, { useEffect,useState,useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
import Router from '../router';
import Playlists from './Playlists';
import PlaylistsFeed from './PlaylistsFeed';
import NavPanel from './NavPanel';

const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {

    let savedSong = JSON.parse(localStorage.getItem("lastPlayedTrack"))  
    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(savedSong ? savedSong : {title:"",url:"",artists:[{name:""}]});
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0.5);
    const [prevSong,setPrevSong]= useState({})
    const [currentSongs,setCurrentSongs] = useState([]);
    const [isSongLoading,setIsSongLoading]= useState(false)
    const [playerFolded,setPlayerFolded] = useState(true)
    const [likedSongs,setLikedSongs] = useState([])

    const audioElem = useRef();

    const fetchLikedSongs = async (id) => {
        try {
          const response = await axios.get(
            `${link}/ya/likedTracks`,);
          setLikedSongs(response.data.library.tracks)
        } catch (err) {
          console.error('Ошибка при получении списка треков:', err);
          console.log(err)
        }
    };

      
    useEffect(()=>{
        fetchLikedSongs()
    },[])


    if (isLoading) return <div>Загрузка</div>

    return (
        <div className="page-content">
          <Navbar setPlayerFolded={setPlayerFolded} setIsSongLoading={setIsSongLoading} audioElem={audioElem} setCurrentSong={setCurrentSong} setisplaying={setisplaying} currentSong={currentSong} isplaying={isplaying} setCurrentPlaylist={setCurrentPlaylist}/>
        <NavPanel/>
        <div className='page-wrapper'> 
        <div className='playlists-container'>
        <PlaylistsFeed setCurrentPlaylist={setCurrentPlaylist}/>
        <Playlists setCurrentPlaylist={setCurrentPlaylist}/>
        </div>
            <div className='player-wrapper'> 
       <Player 
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
         setPrevSong={setPrevSong} prevSong={prevSong}
         currentSongs = {currentSongs} audioElem = {audioElem}
         isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
         likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
         playerFolded={playerFolded}
         children = {<Playlist 
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
          setCurrentSongs={setCurrentSongs}
           currentPlaylist={currentPlaylist} currentSongs={currentSongs}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
              currentSong={currentSong} setCurrentSong={setCurrentSong}
               setisplaying={setisplaying} isplaying={isplaying}
                setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                 likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
                 />}
         />
        
      </div>
        <div className='scroll-to-top'>
            <button className='scroll-to-top-button' type=""></button>
        </div>
        </div>
        <div className='second-image-filter'>
      </div>
        <div className='second-image'>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/800x800` : ""} loading= "lazy" alt=""></img>
      </div>
    
    </div>


    );

};

export default Main;