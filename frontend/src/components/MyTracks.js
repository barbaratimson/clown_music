import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { FaCrown } from "react-icons/fa6"
import { RiArrowDownSFill, RiArrowDropUpFill, RiArrowUpSFill, RiPlayLine } from 'react-icons/ri';

const link = process.env.REACT_APP_YMAPI_LINK

const MyTracks = ({setCurrentPage,setPlayerFolded,currentPlaylist, setCurrentPlaylist, audioElem,setPrevSong, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {

    const [isLoading, setIsLoading] = useState(false);
    
    const [chartResult,setChartResult] = useState()


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
  
      useEffect(()=>{
        fetchYaMudicSongs()
      },[likedSongs])

      useEffect(()=>{
          fetchYaMudicSongs()
      },[])

      if (isLoading) return <Loader></Loader>

    return (
      <div>
        {console.log(chartResult)}
           {chartResult? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(chartResult);setCurrentSong(chartResult.tracks[0].track);setPlayerFolded(false);setCurrentPage("currentPlaylist")}}><RiPlayLine/></div>
                <img className="image" src={chartResult.ogImage ? `http://${chartResult.ogImage.substring(0, chartResult.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{chartResult.title}</div>
                </div>              
                  </div>
                  <div className='chart-songs-wrapper'>
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