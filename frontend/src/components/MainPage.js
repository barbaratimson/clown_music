import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { RiPlayLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { changeModalState } from '../store/modalSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = ({setViewedPlaylist, audioElem,setPrevSong}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [feed,setFeed] = useState()
    
    const dispatch = useDispatch();
    
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))
    const setActive = (state) => dispatch(changeModalState(state))

    const fetchFeedPlaylists = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/feed`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
              setFeed(response.data)
              console.log(response.data)
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
      <>
          <div className="main-page-about">
              <div className="main-page-title">CLOWN MUSIC</div>
              <div className="main-page-under">music service based on Yandex Music api</div>
          </div>
          {feed && feed.generatedPlaylists.length !== 0?
              (<div className="playlists">
      {feed.generatedPlaylists.map((playlist) => playlist.data.available ? (
  <div className="playlist-card" key={playlist.data.playlistUuid} onClick={()=>{setViewedPlaylist(playlist.data);setActive(true)}}>
  <div className="playlist-card-image">
  {/* <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(playlist.data);setPlayerFolded(false)}}><RiPlayLine/></div> */}
  <img src={playlist.data.ogImage ? `http://${playlist.data.ogImage.substring(0, playlist.data.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading = "lazy" alt=""></img>
  </div>
  <div className='playlist-card-info'>
      <div className="playlist-card-desc">{playlist.data.title}</div>
      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
  </div>
</div>
):null)}
</div>
):null}

         <div className='playlist-songs-container' style={{padding: "20px 30px 20px 20px"}}>
                        {feed ? (feed.days[0].tracksToPlay.map((song) => song.available ? (
                          <Track key={song.id} setPrevSong={setPrevSong} audioElem={audioElem} song = {song}></Track>
            ):null)):null}
        
            </div>
          
         </>
    );

};
//<div className="playlists">
//{feed ? (feed.days[0].events.map((playlist) =>(
//  <div className="playlist-card" key={playlist.id} onClick={()=>{setCurrentPlaylist(playlist);setPlayerFolded(false)}}>
//  <div className="playlist-card-image">
//  <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(playlist);setPlayerFolded(false)}}><RiPlayLine/></div>
//  <img src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading = "lazy" alt=""></img>
//  </div>
//  <div className='playlist-card-info'>
//      <div className="playlist-card-desc">{JSON.stringify(playlist.title)}</div>
//      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
//  </div>
//</div>
//))
//):(null)}
//        </div>

export default Chart;