import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { FaCrown } from "react-icons/fa6"
import { RiArrowDownSFill, RiArrowDropUpFill, RiArrowUpSFill, RiCloseFill, RiPlayLine } from 'react-icons/ri';

const link = process.env.REACT_APP_YMAPI_LINK

const ViewPlaylist = ({active, setActive,setCurrentPage,setPlayerFolded,viewedPlaylist, setViewedPlaylist, currentPlaylist, setCurrentPlaylist, audioElem,setPrevSong, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setCurrentSongs,isSongLoading,setIsSongLoading}) => {
    const [isLoading, setIsLoading] = useState(true);

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
                {/* {console.log(viewedPlaylist)} */}
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
                                    <Track key={song.id} setCurrentPlaylist={setCurrentPlaylist} playlist={viewedPlaylist} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song.track ? song.track : song} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}/>
                ))):(null)}
               
            </div>
            ):(null)}
           
         </div>
         </div>
         </div>
         
    );

};

export default ViewPlaylist;