import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaylistsFeed from './PlaylistsFeed';

const link = process.env.REACT_APP_YMAPI_LINK

const Playlists = ({setPlayerFolded,setCurrentPlaylist}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const fetchSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/playlists`,);
              setAllPlaylists(response.data)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
          }
      };
      
      const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/myTracks`,);
              setAllPlaylists(prev =>[...prev,response.data])
              setCurrentPlaylist(response.data)
              setIsLoading(false)
          } catch (err) {   
            console.error('Ошибка при получении списка треков:', err);
          }
      };

      useEffect(()=>{
        fetchSongs()
        fetchYaMudicSongs()
      },[])

      if (isLoading) return <div>Загрузка</div>

    return (
      <div className='playlists-container'>
      <PlaylistsFeed setPlayerFolded={setPlayerFolded} setCurrentPlaylist={setCurrentPlaylist}/>
<div>
          <div className='playlists-title'>Your Playlists</div>
            {allPlaylists ? (
                <div className="playlists">           
                {allPlaylists.map((playlist) => playlist.available ? (
                  <div className="playlist-card" key={playlist.playlistUuid} onClick={()=>{setCurrentPlaylist(playlist);setPlayerFolded(false)}}>
                  <div className="playlist-card-image">
                  <img src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
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
         </div>
    );

};

export default Playlists;