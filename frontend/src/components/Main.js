import React, { useEffect,useState,useRef } from 'react';
import { usePalette } from 'react-palette'
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';
import Artist from './Artist';
import MainPage from './MainPage';
import Chart from './Chart';
import Loader from './Loader';
import ViewPlaylist from './ViewPlaylist';
import MyTracks from './MyTracks';
import {useDispatch, useSelector} from "react-redux"
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { changeCurrentPage } from '../store/currentPageSlice';
import { changeLikedSongs } from '../store/likedSongsSlice';
import { changeModalState} from '../store/modalSlice';
import {changeIsPlaying} from "../store/isSongPlaylingSlice";
import {changeSongLoading} from "../store/isSongLoadingSlice";
import {changeArtist} from "../store/artistSlice";
import {changePlayerFolded} from "../store/playerFolded";
import {showMessage, hideMessage} from "../store/messageSlice";

const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {
    let prevPlaylist = JSON.parse(localStorage.getItem("prevPlaylist"))  
    let volume = localStorage.getItem("player_volume_old")
    const dispatch = useDispatch();
    const [playlistData,setPlaylistData] = useState([])
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))
    const showMessage = (message) => dispatch(showMessage(message))
    const setLikedSongs = (playlist) => dispatch(changeLikedSongs(playlist))
    const likedSongs = useSelector(state => state.likedSongs.likedSongs)
    const [viewedPlaylist, setViewedPlaylist] = useState(prevPlaylist);

    const currentSong = useSelector(state => state.currentSong.currentSong)

    const currentPage = useSelector(state => state.currentPage.currentPage)   
    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))

    const active = useSelector(state => state.modalActive.modalActive)
    const setActive = (state) => dispatch(changeModalState(state))

    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0);
    const [prevSong,setPrevSong]= useState({})

    const playerFolded = useSelector(state => state.playerFolded.playerFolded)
    const setPlayerFolded = (state) => dispatch(changePlayerFolded(state))

    const audioElem = useRef();
    const { data, loading, error } = usePalette(currentSong && currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/800x800` : "")
    const fetchLikedSongs = async (id) => {
        try {
          const response = await axios.get(
            `${link}/ya/likedTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
          setLikedSongs(response.data.library.tracks)
        } catch (err) {
          console.error('Ошибка при получении списка треков:', err);
          console.log(err)
        }
    };
    
    const fetchYaMudicSongs = async () => {
      setIsLoading(true)
        try {
          const response = await axios.get(
            `${link}/ya/myTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setCurrentPlaylist(response.data)
            setViewedPlaylist(response.data)
            setIsLoading(false)
        } catch (err) {   
          console.error('Ошибка при получении списка треков:', err);
        }
    };

    
    useEffect(()=>{
        fetchLikedSongs()
        if(!prevPlaylist){
        fetchYaMudicSongs()
        }
    },[])

    useEffect(()=>{
        if(!playerFolded){
          setCurrentPage("currentPlaylist")
        }
    },[playerFolded])

    useEffect(()=>{
      currentSong ? document.body.style.backgroundColor=data.darkVibrant : document.body.style.backgroundColor="rgb(16, 16, 15)"
    },[data])

    if (isLoading) return <div><div style={{width:"100%",display:"flex",justifyContent:"center",padding:"40px",color:"white",fontSize:"50px",fontWeight:"600"}}>YA CLOWN MUSIC</div><Loader></Loader></div>

    return (
        <div className="page-content">
          {active ? (<ViewPlaylist  active={active} setActive={setActive} setViewedPlaylist={setViewedPlaylist}
                            viewedPlaylist={viewedPlaylist}
                               playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                   audioElem={audioElem}
                                   prevSong = {prevSong} setPrevSong={setPrevSong}
                                    />
):(null)}

          
          <Navbar  setActive={setActive} setViewedPlaylist={setViewedPlaylist}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                 audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                  />
        <div className={`page-content-wrapper ${playerFolded ? "visible" : ""}`}>
          {currentPage && 
          currentPage==="userPlaylists" ? (
            <Playlists setActive={setActive} 
              setViewedPlaylist={setViewedPlaylist}
              />
            ) : 
          currentPage === "artists" ? (
            <Artist setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                    audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}/>
                   ) : 
          currentPage === "chart" ? (
            <Chart
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                     audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}/>
                   ) :
                   currentPage=== "mainPage" ? (
                    <MainPage setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
                        playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                             audioElem={audioElem}
                            prevSong = {prevSong} setPrevSong={setPrevSong}/>
                           ) : currentPage=== "myTracks" ? (
                            <MyTracks
                                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                     audioElem={audioElem}
                                    prevSong = {prevSong} setPrevSong={setPrevSong}/>
                                   ) : null}
        
        </div>
            <div className='player-wrapper'>
       <Player setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         setPrevSong={setPrevSong} prevSong={prevSong}
          audioElem = {audioElem}
         likedSongs = {likedSongs} setLikedSongs={setLikedSongs}
         children = {
         <Playlist
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                 audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                 likedSongs = {likedSongs} setLikedSongs={setLikedSongs} />
                }
         />
        
      </div>
        <div className='scroll-to-top'>
            <button className='scroll-to-top-button' type=""></button>
        </div>
        <div className='second-image-filter'>
      </div>
            <Message/>
    </div>


    );

};

const Message = () => {
    const dispatch = useDispatch();
    const hideMessageFunc = () => dispatch(hideMessage())
    const messageActive = useSelector(state => state.message.active)
    const messageText = useSelector(state => state.message.message)

    useEffect(()=>{
        const a = setTimeout(()=>{
            hideMessageFunc()
        },2000)
        return ()=>{clearTimeout(a)}
    },[messageText])

    return (
        <>
        {messageActive ? (
                <div className="message">{messageText}</div>
            ): null}
        </>
    )
}

export default Main;