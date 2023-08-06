import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const PlaylistsFeed = ({setCurrentPlaylist}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5051/ya/feed',);
              let playlists = response.data.generatedPlaylists.map((playlist) => {
                return playlist.data
            })
              setAllPlaylists(playlists)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };

      useEffect(()=>{
        fetchSongs()
      },[])

      if (isLoading) return <div>Загрузка</div>

    return (
        <div className="page-content">

        <div>
            {allPlaylists ? (
                <div className="playlists">           
                {allPlaylists.map((playlist) => playlist.available ? (
                <div className="playlist-card" key={playlist.playlistUuid} onClick={()=>{setCurrentPlaylist(playlist)}}>
                <div className="playlist-card-image">
                    <img src="https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png" alt=""></img>
                    <div className="playlist-card-desc">{playlist.title}</div>
                    <div className="playlist-card-length">{playlist.trackCount}</div>
                    <div className="playlist-card-play">
                        
                    </div>
                </div>
            </div>
            ):(null))}  
            </div>
            ): (
               <></>
            )}

     
        </div>

    </div>

    );

};

export default PlaylistsFeed;