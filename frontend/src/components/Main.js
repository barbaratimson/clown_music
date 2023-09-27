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
import { changeCurrentSongs } from '../store/currentSongsSlice';
import { changeCurrentPage } from '../store/currentPageSlice';
const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {
    let prevPlaylist = JSON.parse(localStorage.getItem("prevPlaylist"))  
    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const [viewedPlaylist, setViewedPlaylist] = useState(prevPlaylist);
    const [isplaying, setisplaying] = useState(false);

    const currentSong = useSelector(state => state.currentSong.currentSong)   
 
    const currentPage = useSelector(state => state.currentPage.currentPage)   
    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))

    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0.5);
    const [prevSong,setPrevSong]= useState({})
    const [isSongLoading,setIsSongLoading]= useState(false)
    const [playerFolded,setPlayerFolded] = useState(false )
    const [likedSongs,setLikedSongs] = useState([])
    const [active,setActive] = useState(false)
    // const [currentPage,setCurrentPage] = useState(prevPlaylist ? "currentPlaylist" : "myTracks")
    const [artist,setArtist] = useState(currentSong && currentSong.artists ? currentSong.artists[0].name : "")
    const audioElem = useRef();
    const { data, loading, error } = usePalette(currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/800x800` : "")
    const fetchLikedSongs = async (id) => {
        try {
          const response = await axios.get(
            `${link}/ya/likedTracks`,);
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
            `${link}/ya/myTracks`,);
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
                            setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                               playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                 setisplaying={setisplaying} isplaying={isplaying}
                                   audioElem={audioElem}
                                   prevSong = {prevSong} setPrevSong={setPrevSong}
                                   likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
):(null)}

          
          <Navbar  setActive={setActive} setViewedPlaylist={setViewedPlaylist}
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
               setisplaying={setisplaying} isplaying={isplaying}
                 audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                 likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
                   setPlayerFolded={setPlayerFolded} 
                  />
        <div className={`page-content-wrapper ${playerFolded ? "visible" : ""}`}>
          {currentPage && 
          currentPage==="userPlaylists" ? (
            <Playlists setActive={setActive} 
              setViewedPlaylist={setViewedPlaylist} setPlayerFolded={setPlayerFolded} 
              />
            ) : 
          currentPage === "artists" ? (
            <Artist setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
              artist={artist} setArtist={setArtist} 
              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                  setisplaying={setisplaying} isplaying={isplaying}
                    audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}
                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs} />
                   ) : 
          currentPage === "chart" ? (
            <Chart 
              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                  setisplaying={setisplaying} isplaying={isplaying}
                     audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}
                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs} setArtist={setArtist}/>
                   ) :
                   currentPage=== "mainPage" ? (
                    <MainPage setActive={setActive}  setViewedPlaylist={setViewedPlaylist} 
                      setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                        playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                          setisplaying={setisplaying} isplaying={isplaying}
                             audioElem={audioElem}
                            prevSong = {prevSong} setPrevSong={setPrevSong}
                            likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
                           ) : currentPage=== "myTracks" ? (
                            <MyTracks 
                              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                  setisplaying={setisplaying} isplaying={isplaying}
                                     audioElem={audioElem}
                                    prevSong = {prevSong} setPrevSong={setPrevSong}
                                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
                                   ) : (null)}
        
        </div>
            <div className='player-wrapper'> 
       <Player setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         setPrevSong={setPrevSong} prevSong={prevSong}
          audioElem = {audioElem}
         isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
         likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
         playerFolded={playerFolded} setPlayerFolded={setPlayerFolded}
         setArtist={setArtist}
         children = {
         <Playlist setPlayerFolded={setPlayerFolded}
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
           setArtist={setArtist}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
               setisplaying={setisplaying} isplaying={isplaying}
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
    
    </div>


    );

};

export default Main;