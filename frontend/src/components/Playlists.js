import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlists = ({setCurrentPlaylist}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5051/ya/playlists',);
              setAllPlaylists(response.data)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };
      
      const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5051/ya/myTracks',);
              setAllPlaylists(prev =>[...prev,response.data])
              setCurrentPlaylist(response.data)
              console.log(response.data)
              setIsLoading(false)
          } catch (err) {   
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };

      useEffect(()=>{
        fetchSongs()
        fetchYaMudicSongs()
      },[])

      if (isLoading) return <div>Загрузка</div>

    return (
        <div>
            {allPlaylists ? (
                <div className="playlists">           
                {allPlaylists.map((playlist) => playlist.available ? (
                <div className="playlist-card" key={playlist.playlistUuid} onClick={()=>{setCurrentPlaylist(playlist)}}>
                <div className="playlist-card-image">
                <img src="https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png" alt=""></img>
                </div>
                <div className='playlist-card-info'>
                    <div className="playlist-card-desc">{playlist.title}</div>
                    {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
                </div>
            </div>
            ):(null))}  
            </div>
            ): (
               <></>
            )}

     
        </div>

    );

};

export default Playlists;