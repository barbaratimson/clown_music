import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaylistsFeed from './PlaylistsFeed';
import Loader from './Loader';
import { RiAddFill, RiPlayLine } from 'react-icons/ri';

const link = process.env.REACT_APP_YMAPI_LINK

const Playlists = ({setPlayerFolded, setActive, setCurrentPage,setViewedPlaylist,}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(true);
    
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
      

      useEffect(()=>{
        fetchSongs()
      },[])

      if (isLoading) return <Loader></Loader>
    return (
      <div className='playlists-container'>
<div>
          <div className='playlists-title'>Your Playlists</div>
            {allPlaylists ? (
                <div className="playlists">           
                {allPlaylists.map((playlist) => playlist.available ? (
                  <div className="playlist-card" key={playlist.playlistUuid} onClick={()=>{setViewedPlaylist(playlist);setActive(true)}}>
                  <div className="playlist-card-image">
                  {/* <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(playlist);setPlayerFolded(false)}}><RiPlayLine/></div> */}
                  <img src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                  </div>
                  <div className='playlist-card-info'>
                      <div className="playlist-card-desc">{playlist.title}</div>
                      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
                  </div>
              </div>
            ):(null))}  
                              <div className="playlist-card" key={"addPlaylist"} onClick={()=>{}}>
                  <div className="playlist-card-image">
                  <div className='playlist-add-button' onClick={()=>{}}><RiAddFill/></div>
                  </div>
                  <div className='playlist-card-info add'>
                      <div className="playlist-card-desc">Добавить плейлист</div>
                      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
                  </div>
              </div>
            </div>
            ): (
               <></>
            )}
        </div>
         </div>
    );

};

export default Playlists;