import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { FaCrown } from "react-icons/fa6"
import { RiArrowDownSFill, RiArrowDropUpFill, RiArrowUpSFill, RiPlayLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const MyTracks = ({setCurrentPage,setPlayerFolded, audioElem,setPrevSong, likedSongs, setLikedSongs, isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {

    const [isLoading, setIsLoading] = useState(false);
    
    const [chartResult,setChartResult] = useState()

    const currentSong = useSelector(state => state.currentSong.currentSong) 
    const dispatch = useDispatch();
    const setCurrentSong = (song) => dispatch(changeCurrentSong(song))
    const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/myTracks`,);
              setChartResult(response.data)
              setIsLoading(false)
          } catch (err) {   
            console.error('Ошибка при получении списка треков:', err);
          }
      };

      function msToTime(duration) {
          var seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + "h:" + minutes + "m:" + seconds + "s";
      }
  
      useEffect(()=>{
        fetchYaMudicSongs()
      },[likedSongs])

      useEffect(()=>{
          fetchYaMudicSongs()
      },[])

      if (isLoading) return <Loader></Loader>

    return (
      <div>
           {chartResult? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button heart' onClick={()=>{setCurrentPlaylist(chartResult);setCurrentSong(chartResult.tracks[0].track);setPlayerFolded(false);setCurrentPage("currentPlaylist")}}><RiPlayLine/></div>
                <img className="image heart" src={chartResult.ogImage ? `http://${chartResult.ogImage.substring(0, chartResult.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{chartResult.title}</div>
                <div className='artist-genres'>Tracks:{chartResult.trackCount}</div>  
                <div className='artist-genres'>Duration {msToTime(chartResult.durationMs)}</div>  
                </div>              
                  </div>
                  <div className='chart-songs-wrapper my-tracks'>
                {chartResult.tracks.map((song)=> song.track.available ? (
                                    <Track key={song.id} setCurrentPlaylist={setCurrentPlaylist} playlist={chartResult} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song.track} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}/>
                ):(null))}   
                </div>   
            </div>
            ):(null)}
           
         </div>
    );

};

export default MyTracks;