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
              console.log(response.data)
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

      const fetchPlaylistSongs = async (id) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/playlist/tracks/${id}`,);
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
              'http://localhost:5051/ya/myTracks',);
              setAllPlaylists(prev => prev.concat(response.data))
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
        fetchYaMudicSongs()
      },[])

      if (isLoading) return <div>Загрузка заебал</div>

    return (
        <div className="page-content">

        <div className="songs">
            {allPlaylists ? (
                <div>
                
                {allPlaylists.map((playlist) => (
                    <div>
                {playlist.available ? (
                <div className="song-card" key={playlist.title} onClick={()=>{console.log(playlist);fetchPlaylistSongs(playlist.kind)}}>
                <div className="card-image">
                    <img src="https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png" alt=""></img>
                    <div className="card-desc">{playlist.title}</div>
                    <div className="card-length">{}</div>
                    <div className="card-play">
                        
                    </div>
                </div>
            </div> ): (<></>)}
            </div>
            ))}
            </div>
            ): (
                <></>
            )}

     
        </div>

    </div>

    );

};

export default Playlists;