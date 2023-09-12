import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = ({setCurrentPage,setPlayerFolded,currentPlaylist,audioElem,setPrevSong, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [chartResult,setChartResult] = useState()
    const fetchChart = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/chart`);
              setChartResult(response.data)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
          }
      };

      useEffect(()=>{
          fetchChart()
      },[])

      if (isLoading) return <Loader></Loader>

    return (
      <div>
        {console.log(chartResult)}
           {chartResult? (
                <div>
                  <div className='artist-info-section'>
                <img className="image" src={chartResult.chart.ogImage ? `http://${chartResult.chart.ogImage.substring(0, chartResult.chart.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                <div className='artist-info'>
                <div className='artist-name'>{chartResult.chart.title}</div>
                <div className='artist-genres'>{chartResult.chart.description}</div>  
                </div>              
                  </div>
                {chartResult.chart.tracks.map((song)=>(
                                    <Track key={song.id} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song.track} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
                ))}      
            </div>
            ):(null)}
           
         </div>
    );

};

export default Chart;