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
import { changeCurrentPage } from '../store/currentPageSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = ({audioElem,setPrevSong}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [chartResult,setChartResult] = useState()

    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const dispatch = useDispatch();
    const setCurrentSong = (song) => dispatch(changeCurrentSong(song))

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
           {chartResult? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button' onClick={()=>{setCurrentPlaylist(chartResult.chart);setCurrentSong(chartResult.chart.tracks[0].track)}}><RiPlayLine/></div>
                <img className="image" src={chartResult.chart.ogImage ? `http://${chartResult.chart.ogImage.substring(0, chartResult.chart.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{chartResult.chart.title}</div>
                <div className='artist-genres'>{chartResult.chart.description}</div>  
                </div>              
                  </div>
                  <div className='chart-songs-wrapper'>
                {chartResult.chart.tracks.map((song)=>(
                                    <div className='chart-song-wrapper'>
                              {song.chart.position === 1 ? (<div className='chart-song-crown'><FaCrown/></div>) : (null)}
                              <div className='chart-song-position'>{song.chart.position}</div>
                              <div className='chart-song-progress-wrapper'>
                                {song.chart.progress === "up" ? (<div className='chart-song-progress-arrow green'><RiArrowUpSFill/></div>) : (null)}
                              <div className={`chart-song-progress ${song.chart.progress === "up" ? "green" : song.chart.progress === "down" ? "red" : ""}`}>{song.chart.shift !==0  ? song.chart.progress === "new" ? "NEW" : Math.abs(song.chart.shift)  : "-"}</div>
                              {song.chart.progress === "down" ? (<div className='chart-song-progress-arrow red'><RiArrowDownSFill/></div>) : (null)}
                              </div>
                                    <Track key={song.id} playlist={chartResult.chart} setPrevSong={setPrevSong} audioElem={audioElem} song = {song.track}/>
                  </div>
                ))}   
                </div>   
            </div>
            ):(null)}
           
         </div>
    );

};

export default Chart;