import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { FaCrown } from "react-icons/fa6"
import { RiArrowDownSFill, RiArrowDropUpFill, RiArrowUpSFill, RiCloseFill, RiPlayLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { changeCurrentPage } from '../store/currentPageSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const ViewPlaylist = ({active, setActive,setPlayerFolded,viewedPlaylist, setViewedPlaylist, audioElem,setPrevSong,isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {
    const [isLoading, setIsLoading] = useState(true);

    const currentSong = useSelector(state => state.currentSong.currentSong) 
    const dispatch = useDispatch();
    const setCurrentSong = (song) => dispatch(changeCurrentSong(song))
    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const fetchPlaylistSongs = async (userId,kind) => {
        setIsLoading(true)
            try {
              const response = await axios.get(
                `${link}/ya/playlist/tracks/${userId}/${kind}`,);
                setViewedPlaylist(prev=>({...prev,tracks:response.data}))
                setIsLoading(false)
            } catch (err) {
              console.error('Ошибка при получении списка треков:', err);
              console.log(err)
            }
        };

  
        const fetchYaSongInfo = async (id) => {
          try {
            const response = await axios.get(
              `${link}/ya/trackinfo/${id}`,);
            return response.data
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };

      const fetchAlbum = async (albumId) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/album/${albumId}`);
              setIsLoading(false)
              response.data.tracks = response.data.volumes[0]
              return response.data
          } catch (err) {
            setIsLoading(false)
            setCurrentPage("currentPlaylist")
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
        const handleFeed = async () => {
        if (viewedPlaylist && viewedPlaylist.tracks && viewedPlaylist.generatedPlaylistType){
          setIsLoading(true)
         let result = await Promise.all(viewedPlaylist.tracks.map(async (track) => {
            return await fetchYaSongInfo(track.id)
        }));
        setViewedPlaylist((prev)=>({...prev,tracks:result}))
        setIsLoading(false)
        } else if (viewedPlaylist.owner) {
          fetchPlaylistSongs(viewedPlaylist.kind,viewedPlaylist.owner.uid)
        } else if (viewedPlaylist.type === "album") {
          setViewedPlaylist({...await fetchAlbum(viewedPlaylist.id),type:"album"})
          setIsLoading(false)
        }
      }
      handleFeed()
      },[viewedPlaylist.uid])


      // if (isLoading) return <Loader></Loader>
    return (
      <div>
                                          {console.log(viewedPlaylist)}
          <div className={"modal"} onClick={()=>setActive(false)}>
            <div className='modal-close'><RiCloseFill/></div>
            <div className={"modal-content"} onClick={(e)=>e.stopPropagation()}>
              {console.log(viewedPlaylist)}
           {viewedPlaylist? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button' style={{pointerEvents:`${isLoading ? "none" : "all"}`}} onClick={()=>{setCurrentPlaylist(viewedPlaylist);setCurrentSong(viewedPlaylist.tracks[0]);setActive(false);setPlayerFolded(false)}}><RiPlayLine/></div>
                <img className="image" src={viewedPlaylist.ogImage ? `http://${viewedPlaylist.ogImage.substring(0, viewedPlaylist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{viewedPlaylist.title}</div>
                <div className='artist-genres'>{viewedPlaylist.description}</div>  
                </div>              
                  </div>
                  {isLoading ? (<Loader/>) : viewedPlaylist.tracks ? (viewedPlaylist.tracks.map((song)=>(
                                    <Track key={song.id} playlist={viewedPlaylist} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song.track ? song.track : song} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}/>
                ))):(null)}
               
            </div>
            ):(null)}
           
         </div>
         </div>
         </div>
         
    );

};

export default ViewPlaylist;