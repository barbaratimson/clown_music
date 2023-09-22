import React, { useEffect,useState,useRef } from 'react';
import Palette, { usePalette } from 'react-palette'
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
const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {

    let savedSong = JSON.parse(localStorage.getItem("lastPlayedTrack"))  
    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [viewedPlaylist, setViewedPlaylist] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(savedSong ? savedSong : {title:"",url:"",artists:[{name:""}]});
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0.5);
    const [prevSong,setPrevSong]= useState({})
    const [currentSongs,setCurrentSongs] = useState([]);
    const [isSongLoading,setIsSongLoading]= useState(false)
    const [playerFolded,setPlayerFolded] = useState(true)
    const [likedSongs,setLikedSongs] = useState([])
    const [active,setActive] = useState(false)
    const [currentPage,setCurrentPage] = useState("userPlaylists")
    const [artist,setArtist] = useState(currentSong && currentSong.artists.length !== 0 ? currentSong.artists[0].name : "")

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
        fetchYaMudicSongs()
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

          {active ? (<ViewPlaylist  active={active} setActive={setActive} setViewedPlaylist={setViewedPlaylist} setCurrentPage={setCurrentPage} 
                            viewedPlaylist={viewedPlaylist}
                            setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                            setCurrentSongs={setCurrentSongs}
                             currentPlaylist={currentPlaylist} currentSongs={currentSongs}
                               playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                currentSong={currentSong} setCurrentSong={setCurrentSong}
                                 setisplaying={setisplaying} isplaying={isplaying}
                                  setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                                   prevSong = {prevSong} setPrevSong={setPrevSong}
                                   likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
):(null)}

          
          <Navbar currentPage={currentPage} setActive={setActive} setViewedPlaylist={setViewedPlaylist}
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
          setCurrentSongs={setCurrentSongs}
           currentPlaylist={currentPlaylist} currentSongs={currentSongs}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
              currentSong={currentSong} setCurrentSong={setCurrentSong}
               setisplaying={setisplaying} isplaying={isplaying}
                setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                 likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
                  setCurrentPage={setCurrentPage} setPlayerFolded={setPlayerFolded} 
                  />
        <div className={`page-content-wrapper ${playerFolded ? "visible" : ""}`}>
          {currentPage && 
          currentPage==="userPlaylists" ? (
            <Playlists setActive={setActive} setCurrentPage={setCurrentPage} 
              setViewedPlaylist={setViewedPlaylist} setPlayerFolded={setPlayerFolded} 
              setCurrentPlaylist={setCurrentPlaylist}/>
            ) : 
          currentPage === "artists" ? (
            <Artist setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
              artist={artist} setArtist={setArtist} setCurrentPage={setCurrentPage} 
              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
              setCurrentSongs={setCurrentSongs}
              currentPlaylist={currentPlaylist} currentSongs={currentSongs}
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                  currentSong={currentSong} setCurrentSong={setCurrentSong}
                  setisplaying={setisplaying} isplaying={isplaying}
                    setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}
                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs} />
                   ) : 
          currentPage === "chart" ? (
            <Chart setCurrentPage={setCurrentPage} 
              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
              setCurrentSongs={setCurrentSongs}
              currentPlaylist={currentPlaylist} currentSongs={currentSongs}
                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                  currentSong={currentSong} setCurrentSong={setCurrentSong}
                  setisplaying={setisplaying} isplaying={isplaying}
                    setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                    prevSong = {prevSong} setPrevSong={setPrevSong}
                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs} setArtist={setArtist}/>
                   ) :
                   currentPage=== "mainPage" ? (
                    <MainPage setActive={setActive}  setViewedPlaylist={setViewedPlaylist} setCurrentPage={setCurrentPage} 
                      setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                      setCurrentSongs={setCurrentSongs}
                      currentPlaylist={currentPlaylist} currentSongs={currentSongs}
                        playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                          currentSong={currentSong} setCurrentSong={setCurrentSong}
                          setisplaying={setisplaying} isplaying={isplaying}
                            setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                            prevSong = {prevSong} setPrevSong={setPrevSong}
                            likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
                           ) : currentPage=== "myTracks" ? (
                            <MyTracks setCurrentPage={setCurrentPage} 
                              setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
                              setCurrentSongs={setCurrentSongs}
                              currentPlaylist={currentPlaylist} currentSongs={currentSongs}
                                playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                                  currentSong={currentSong} setCurrentSong={setCurrentSong}
                                  setisplaying={setisplaying} isplaying={isplaying}
                                    setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                                    prevSong = {prevSong} setPrevSong={setPrevSong}
                                    likedSongs = {likedSongs} setLikedSongs={setLikedSongs}/>
                                   ) : (null)}
        
        </div>
            <div className='player-wrapper'> 
       <Player setActive={setActive}  setViewedPlaylist={setViewedPlaylist}
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
         setPrevSong={setPrevSong} prevSong={prevSong}
         currentSongs = {currentSongs} audioElem = {audioElem}
         isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
         likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
         playerFolded={playerFolded} setPlayerFolded={setPlayerFolded}
         setArtist={setArtist} setCurrentPage={setCurrentPage}
         currentPlaylist={currentPlaylist}
         children = {
         <Playlist setCurrentPage={setCurrentPage} setPlayerFolded={setPlayerFolded}
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
          setCurrentSongs={setCurrentSongs} setArtist={setArtist}
           currentPlaylist={currentPlaylist} currentSongs={currentSongs}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
              currentSong={currentSong} setCurrentSong={setCurrentSong}
               setisplaying={setisplaying} isplaying={isplaying}
                setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
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