import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
import PlaylistYaMusic from './PlaylistYaMusic';
const Main = () => {
    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [yaMusic,setYaMusic] = useState(false)
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(JSON.parse(localStorage.getItem("lastPlayedTrack")));
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 50);
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

      const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5051/',);
              setPlaylistDataYa(response.data)
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
      
      const handlePlayListChange = () =>{
        setYaMusic(!yaMusic)
        if (yaMusic){
            setCurrentPlaylist(playlistData)
        } else {
            setCurrentPlaylist(playlistDataYa)
        }
      }
      
    useEffect(()=>{
        fetchSongs()
        fetchYaMudicSongs()
    },[])

    if (isLoading) return <div>Загрузка заебал</div>

    return (
        <div className="page-content">
            <Navbar/>
            <BsMusicNoteBeamed className='yaMusic-switch' style={{color:`${yaMusic ? "yellow" : "red"}`}} onClick={()=>handlePlayListChange()}/>
        {/* <div className="songs">

            <div className="song-card">
                <div className="card-image">
                    <img src="https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png" alt=""></img>
                    <div className="card-desc">Понравилось</div>
                    <div className="card-length">28</div>
                    <div className="card-play">
                        
                    </div>
                </div>
            </div>

     
        </div> */}
        {playlistData && playlistData.length !== 0 ? (
            <div> 
        {!yaMusic ? (
       <Playlist currentPlaylist = {playlistData} setCurrentPlaylist = {setCurrentPlaylist} currentSong={currentSong} setCurrentSong={setCurrentSong} setisplaying={setisplaying} isplaying={isplaying}/>
        ):(
       <PlaylistYaMusic currentPlaylist = {playlistDataYa} setCurrentPlaylist = {setCurrentPlaylist} currentSong={currentSong} setCurrentSong={setCurrentSong} setisplaying={setisplaying} isplaying={isplaying}/>
        )
        }
      <Player 
      currentPlaylist={currentPlaylist} setSongs={setCurrentPlaylist}
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         audioElem={audioElem} 
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
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