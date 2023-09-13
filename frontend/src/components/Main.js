import React, { useEffect,useState,useRef } from 'react';
import Palette, { usePalette } from 'react-palette'
import { BsMusicNoteBeamed } from 'react-icons/bs';
import axios from 'axios';
import Navbar from './Navbar';
import Player from './Player';
import Playlist from './Playlist';
import Router from '../router';
import Playlists from './Playlists';
import PlaylistsFeed from './PlaylistsFeed';
import NavPanel from './NavPanel';
import Artist from './Artist';
import Chart from './Chart';
import Loader from './Loader';
const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {

    let savedSong = JSON.parse(localStorage.getItem("lastPlayedTrack"))  
    let volume = localStorage.getItem("player_volume")
    const [playlistData,setPlaylistData] = useState([])
    const [playlistDataYa,setPlaylistDataYa] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(savedSong ? savedSong : {title:"",url:"",artists:[{name:""}]});
    const [audioVolume,setAudioVolume] = useState(volume ? volume : 0.5);
    const [prevSong,setPrevSong]= useState({})
    const [currentSongs,setCurrentSongs] = useState([]);
    const [isSongLoading,setIsSongLoading]= useState(false)
    const [playerFolded,setPlayerFolded] = useState(true)
    const [likedSongs,setLikedSongs] = useState([])
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
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} setPlayerFolded={setPlayerFolded} setIsSongLoading={setIsSongLoading} audioElem={audioElem} setCurrentSong={setCurrentSong} setisplaying={setisplaying} currentSong={currentSong} isplaying={isplaying} setCurrentPlaylist={setCurrentPlaylist}/>
        <div className={`page-content-wrapper ${playerFolded ? "visible" : ""}`}>
          {currentPage && currentPage==="userPlaylists" ? (<Playlists setPlayerFolded={setPlayerFolded} setCurrentPlaylist={setCurrentPlaylist}/>) : 
          currentPage === "artists" ? (<Artist 
            artist={artist} setArtist={setArtist} setCurrentPage={setCurrentPage} 
            setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
            setCurrentSongs={setCurrentSongs}
             currentPlaylist={currentPlaylist} currentSongs={currentSongs}
               playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                currentSong={currentSong} setCurrentSong={setCurrentSong}
                 setisplaying={setisplaying} isplaying={isplaying}
                  setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                   prevSong = {prevSong} setPrevSong={setPrevSong}
                   likedSongs = {likedSongs} setLikedSongs={setLikedSongs} />): 
          currentPage === "chart"? (<Chart setCurrentPage={setCurrentPage} 
            setPlayerFolded={setPlayerFolded}   isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
            setCurrentSongs={setCurrentSongs}
             currentPlaylist={currentPlaylist} currentSongs={currentSongs}
               playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
                currentSong={currentSong} setCurrentSong={setCurrentSong}
                 setisplaying={setisplaying} isplaying={isplaying}
                  setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                   prevSong = {prevSong} setPrevSong={setPrevSong}
                   likedSongs = {likedSongs} setLikedSongs={setLikedSongs}></Chart>) : (null)}
        
        </div>
            <div className='player-wrapper'> 
       <Player 
       isplaying={isplaying} setisplaying={setisplaying}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
         currentSong={currentSong} setCurrentSong={setCurrentSong} 
         setPrevSong={setPrevSong} prevSong={prevSong}
         currentSongs = {currentSongs} audioElem = {audioElem}
         isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
         likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
         playerFolded={playerFolded} setPlayerFolded={setPlayerFolded}
         setArtist={setArtist} setCurrentPage={setCurrentPage}
         children = {<Playlist 
          isSongLoading={isSongLoading} setIsSongLoading={setIsSongLoading}
          setCurrentSongs={setCurrentSongs}
           currentPlaylist={currentPlaylist} currentSongs={currentSongs}
             playlistData = {playlistData} setPlaylistDataYa = {setPlaylistDataYa}
              currentSong={currentSong} setCurrentSong={setCurrentSong}
               setisplaying={setisplaying} isplaying={isplaying}
                setCurrentPlaylist={setCurrentPlaylist} audioElem={audioElem}
                 prevSong = {prevSong} setPrevSong={setPrevSong}
                 likedSongs = {likedSongs} setLikedSongs={setLikedSongs} 
                 />}
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