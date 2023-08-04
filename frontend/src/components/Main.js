import React, { useEffect,useState,useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
import PlaylistYaMusic from './PlaylistYaMusic';
import Router from '../router';
import Playlists from './Playlists';
import PlaylistsFeed from './PlaylistsFeed';
const Main = () => {

    let savedSong = JSON.parse(localStorage.getItem("lastPlayedTrack"))

    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [yaMusic,setYaMusic] = useState(localStorage.getItem("yaMusic"))
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(savedSong ? savedSong : {title:" ",url:" ",artists:[{name:""}]});
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0.5);
    const [prevSong,setPrevSong]= useState({})
    const [currentSongs,setCurrentSongs] = useState([]);
    const [isSongLoading,setIsSongLoading]= useState(false)
    const audioElem = useRef();
    
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5050/',);
              setPlaylistData(response.data)
              setIsLoading(false)
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
        fetchSongs()
    },[])

    if (isLoading) return <div>Загрузка заебал</div>

    return (
        <div className="page-content">
            <Navbar/>
        <PlaylistsFeed setCurrentPlaylist={setCurrentPlaylist}/>
        <Playlists setCurrentPlaylist={setCurrentPlaylist}/>
        {playlistData && playlistData.length !== 0 ? (
            <div> 
       <Playlist isSongLoading={isSongLoading} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSongs={currentSongs}  playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa} currentSong={currentSong} setCurrentSong={setCurrentSong} setisplaying={setisplaying} isplaying={isplaying} setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem} prevSong = {prevSong} setPrevSong={setPrevSong}/>
      <Player 
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
         setPrevSong={setPrevSong} currentSongs = {currentSongs}
         isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
         />
      </div>
        ):(
            <></>
        )
        }

    <div className='footer'>
        <div className="">Sergey Sokolov CLOWN_MUSIC 2023</div>
    </div>
    </div>


    );

};

export default Main;