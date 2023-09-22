import React, { useEffect,useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlayFill } from 'react-icons/bs';
import { HiSearch } from "react-icons/hi";
import { RiPauseFill, RiPauseMiniFill, RiPlayFill, RiPlayMiniFill, RiSearch2Line, RiSearchLine } from 'react-icons/ri';
import Track from './Track';

const link = process.env.REACT_APP_YMAPI_LINK

const Navbar = ({currentPage,setViewedPlaylist, setActive, setCurrentPage,setPlayerFolded,setCurrentPlaylist,currentPlaylist,audioElem,setPrevSong, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setisplaying,setCurrentSongs,currentSongs, isSongLoading,setIsSongLoading, prevSong}) => {
    const [search,setSearch] = useState('')
    const [searchResults,setSearchResults] = useState()
    const [showUserMenu,setShowUserMenu] = useState(false)
    const [searchFolded,setSearchFolded] = useState(true)
    const input = useRef(null) 
    const handleSearch = async () => {
        if (search){
          try {
            const response = await axios.get(
              `${link}/ya/search/${search}`);
              setSearchResults(response.data)
              console.log(response.data)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
        }
      };

    useEffect(() => {
        let Debounce = setTimeout(()=>{
            handleSearch()
        },350)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);
    
    useEffect(()=>{
        if(!searchFolded){
            input.current.focus()
        }
    },[searchFolded])
    return (
        <div className="nav">
                <div className="nav-wrapper">
        <div className='nav-selection'>               
        <div className={`nav-selection-button nav-logo ${currentPage === "mainPage" ? "active" : ""}`} onClick={()=>{setCurrentPage("mainPage");setPlayerFolded(true)}}><div className="logo"><div className="logo-pic">🤡</div>{/* <div className="logo-text">YaClown Music</div> */}</div></div>
        <div className={`nav-selection-button nav-player ${currentPage === "currentPlaylist" ? "active" : ""}`} onClick={()=>{setCurrentPage("currentPlaylist");setPlayerFolded(false)}}>{isplaying ? <RiPlayFill/> : <RiPauseFill/>}</div>
        <div className={`nav-selection-button ${currentPage === "userPlaylists" ? "active" : ""}`} onClick={()=>{setCurrentPage("userPlaylists");setPlayerFolded(true)}}>PLAYLISTS</div>
        <div className={`nav-selection-button ${currentPage === "myTracks" ? "active" : ""}`} onClick={()=>{setCurrentPage("myTracks");setPlayerFolded(true)}}>MyTRACKS</div>
        <div className={`nav-selection-button ${currentPage === "chart" ? "active" : ""}`} onClick={()=>{setCurrentPage("chart");setPlayerFolded(true)}}>CHART</div>
        <div className={`nav-selection-button ${currentPage === "artists" ? "active" : ""}`} onClick={()=>{setCurrentPage("artists");setPlayerFolded(true)}}>ARTIST</div>
        </div>
    <div className="nav-search-wrapper">
    <div className="nav-searchbar">
    <input ref={input} className={`nav-search ${searchFolded ? "folded" : ""}`} type='text' onChange={(e) => {setSearch(`${e.target.value}`)}}/>
        <div className="nav-search-start" style={{fontSize:`${searchFolded ? "35px" : "30px"}`}} onClick={()=>{setSearchFolded(!searchFolded)}}><HiSearch/></div>
    </div>
    <div className={`nav-search-results ${!search || searchFolded ? "hidden" : ""}`}>
        {searchResults && searchResults.tracks ? (searchResults.tracks.results.map(song=>(
           <Track key={song.id} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
        ))):(<></>)}

         {searchResults && searchResults.playlists ? (searchResults.playlists.results.map(playlist=>(
           <div className="playlist-song" key={playlist.playlistUuid} onClick={()=>{setViewedPlaylist(playlist);setActive(true)}}>
                 <div className='playlist-song-image'>      
                 <img src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                 </div>
                 <div className='playlist-song-title'>
                 {playlist.title}
                 </div>
              
               </div>
        ))):(<></>)}
        
    </div>
    </div>
    {/* <button onClick={()=>{localStorage.clear()}}>LS CLEAR</button> */}
    <div className="nav-user" onClick={()=>{setShowUserMenu(!showUserMenu)}}>
        {/* <div className ="user-username">Barbaratimson</div> */}
        <div className="user-avatar">
            <img src="https://sun9-36.userapi.com/impg/KBThyRabdLXw6Km0CnJ4gQJKcR7iw5Uu8T6wpg/D0Bh4x-veqY.jpg?size=822x1024&quality=95&sign=8f9825c03df99a8adaa7b94c9d0639d5&type=album" alt=""></img>
        </div>
    </div>
    <div className={`user-menu ${!showUserMenu? "hidden" : ""}`}></div>
</div>

    </div>
        
    );

};

export default Navbar;


