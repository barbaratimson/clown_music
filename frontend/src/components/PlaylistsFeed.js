import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import { RiPlayLine } from 'react-icons/ri';

const link = process.env.REACT_APP_YMAPI_LINK

const PlaylistsFeed = ({setPlayerFolded,setCurrentPlaylist}) => {
    const [allPlaylists,setAllPlaylists] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const fetchFeedPlaylists = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/feed`,);
              setAllPlaylists(response.data.generatedPlaylists)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };
      useEffect(()=>{
        fetchFeedPlaylists()
      },[])
      if (isLoading) return <Loader></Loader>
    return (
        <div>
          <div className='playlists-title'>Recommended</div>

                <div className="playlists">           
                {allPlaylists ? (allPlaylists.map((playlist) => playlist.data.available ? (
                  <div className="playlist-card" key={playlist.data.playlistUuid} onClick={()=>{setCurrentPlaylist(playlist.data);setPlayerFolded(false)}}>
                  <div className="playlist-card-image">
                  <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(playlist);setPlayerFolded(false)}}><RiPlayLine/></div>
                  <img src={playlist.data.ogImage ? `http://${playlist.data.ogImage.substring(0, playlist.data.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                  </div>
                  <div className='playlist-card-info'>
                      <div className="playlist-card-desc">{playlist.data.title}</div>
                      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
                  </div>
              </div>
            ):(null))
            ):(null)}  
            </div>


     
        </div>

    );

};

export default PlaylistsFeed;