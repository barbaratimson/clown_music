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
    const [isSongLoading,setIsSongLoading]= useState(false)
    const [prevSong,setPrevSong]= useState({})
    const audioElem = useRef();
    
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5050/',);
              setPlaylistData(response.data)
              setCurrentPlaylist(response.data)
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
        <Playlists setCurrentPlaylist={setCurrentPlaylist}/>
        {playlistData && playlistData.length !== 0 ? (
            <div> 
        {/* {!yaMusic ? ( */}
       <Playlist currentPlaylist={currentPlaylist}  playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa} currentSong={currentSong} setCurrentSong={setCurrentSong} setisplaying={setisplaying} isplaying={isplaying} setIsSongLoading={setIsSongLoading} setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem} prevSong = {prevSong} setPrevSong={setPrevSong}/>
        {/* ):( */}
       {/* <PlaylistYaMusic playlistDataYa = {playlistDataYa} setPlaylistDataYa = {setPlaylistDataYa} currentSong={currentSong} setCurrentSong={setCurrentSong} setisplaying={setisplaying} isplaying={isplaying} setIsSongLoading={setIsSongLoading} setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem} prevSong = {prevSong} setPrevSong={setPrevSong}/> */}
        {/* )
        } */}
      <Player 
      currentPlaylist={currentPlaylist} setSongs={setCurrentPlaylist}
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         audioElem={audioElem} 
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
         isSongLoading = {isSongLoading} setIsSongLoading={setIsSongLoading}
         setPrevSong={setPrevSong} prevSong={prevSong}
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