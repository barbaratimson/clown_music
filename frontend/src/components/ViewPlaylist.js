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
import { changeModalState } from '../store/modalSlice';
import {changeArtist} from "../store/artistSlice";
import {changePlayerFolded} from "../store/playerFolded";

const link = process.env.REACT_APP_YMAPI_LINK

const ViewPlaylist = ({viewedPlaylist, setViewedPlaylist, audioElem,setPrevSong,setCurrentSongs}) => {
    const [isLoading, setIsLoading] = useState(true);

    const setActive = (state) => dispatch(changeModalState(state))
    const dispatch = useDispatch();
    const setCurrentSong = (song) => dispatch(changeCurrentSong(song))
    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))
    const setPlayerFolded = (state) => dispatch(changePlayerFolded(state))


    const fetchPlaylistSongs = async (userId,kind) => {
        setIsLoading(true)
            try {
              const response = await axios.get(
                `${link}/ya/playlist/tracks/${userId}/${kind}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
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
              `${link}/ya/trackinfo/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
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
              `${link}/ya/album/${albumId}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
              setIsLoading(false)
              response.data.tracks = response.data.volumes[0]
              return response.data
          } catch (err) {
            setIsLoading(false)
            setCurrentPage("currentPlaylist")
            console.error('Ошибка при получении списка треков:', err);
          }
      };

      const handlePlaylistChange = (playlist) => {
        setCurrentPlaylist(playlist)
        audioElem.current.src=""
        setCurrentSong(playlist.tracks[0])
        setActive(false)
        setPlayerFolded(false)
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
          <div className={"modal"} onClick={()=>setActive(false)}>
            <div className='modal-close'><RiCloseFill/></div>
            <div className={"modal-content"} onClick={(e)=>e.stopPropagation()}>
           {viewedPlaylist? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button' style={{pointerEvents:`${isLoading ? "none" : "all"}`}} onClick={()=>{handlePlaylistChange(viewedPlaylist)}}><RiPlayLine/></div>
                <img className="image" src={viewedPlaylist.ogImage ? `http://${viewedPlaylist.ogImage.substring(0, viewedPlaylist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{viewedPlaylist.title}</div>
                <div className='artist-genres'>{viewedPlaylist.description}</div>  
                </div>              
                  </div>
                  {isLoading ? (<Loader/>) : viewedPlaylist.tracks ? (viewedPlaylist.tracks.map((song)=>(
                                    <Track key={song.id} playlist={viewedPlaylist} setPrevSong={setPrevSong} audioElem={audioElem} song = {song.track ? song.track : song}/>
                ))):null}
               
            </div>
            ):null}
           
         </div>
         </div>
         </div>
         
    );

};

export default ViewPlaylist;