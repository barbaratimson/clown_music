import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const link = process.env.REACT_APP_YMAPI_LINK

const PlaylistsFeed = ({setCurrentPlaylist}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const fetchFeedPlaylists = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/feed`,);
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
        fetchFeedPlaylists()
      },[])

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

export default PlaylistsFeed;