import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
const Main = () => {
    let volume = localStorage.getItem("player_volume")
    const [songsdata,setSongsData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [songs, setSongs] = useState(songsdata);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState();
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 50);
  
    const audioElem = useRef();
    
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5050/',);
              setSongsData(response.data)
              setCurrentSong(response.data[0])
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка name change:', err);
            if (err.code === "ERR_BAD_REQUEST"){
                alert("Такой аккаунт уже существует")
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
        {songsdata && songsdata.length !== 0 ? (
            <div> 
        <Playlist songs = {songsdata} currentSong={currentSong} setCurrentSong={setCurrentSong}/>
      <Player songs={songsdata} setSongs={setSongs} isplaying={isplaying} setisplaying={setisplaying} audioVolume={audioVolume} setAudioVolume={setAudioVolume} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong} />
      </div>
        ):(
            <>Hui</>
        )
        }

    <div className='footer'>
        <div class="">Im footer!</div>
    </div>
    </div>


    );

};

export default Main;