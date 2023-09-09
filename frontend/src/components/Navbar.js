import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlayFill } from 'react-icons/bs';

const link = process.env.REACT_APP_YMAPI_LINK

const Navbar = ({currentPage,setCurrentPage,setCurrentSong,setPlayerFolded,setIsSongLoading,audioElem,setisplaying,currentSong,isplaying,setCurrentPlaylist}) => {
    const [search,setSearch] = useState('')
    const [searchResults,setSearchResults] = useState()
    const [showUserMenu,setShowUserMenu] = useState(false)
    
    const handleSongClick = async (song) => {
        if (song.id === currentSong.id && isplaying){
            audioElem.current.pause()
        } else if (song.id !== currentSong.id) {
          setIsSongLoading(true)
          audioElem.current.currentTime = 0
          currentSong.progress = 0
          audioElem.current.src = ' '
            setCurrentSong(song)
        } else{
            audioElem.current.play().catch(err=>console.error(err))
      }
    }

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
    
    return (
        <div className="nav">
                <div className="nav-wrapper">
                <div className="logo">
        <div className="logo-pic">🤡</div>
        {/* <div className="logo-text">YaClown Music</div> */}
        </div>
        <div className='nav-selection'>               
        <div className={`nav-selection-button ${currentPage === "currentPlaylist" ? "active" : ""}`} onClick={()=>{setCurrentPage("currentPlaylist");setPlayerFolded(false)}}>Current playlist</div>
        <div className={`nav-selection-button ${currentPage === "userPlaylists" ? "active" : ""}`} onClick={()=>{setCurrentPage("userPlaylists");setPlayerFolded(true)}}>Your playlists</div>
        <div className={`nav-selection-button ${currentPage === "chart" ? "active" : ""}`} onClick={()=>{setCurrentPage("chart");setPlayerFolded(true)}}>Chart</div>
        <div className={`nav-selection-button ${currentPage === "artists" ? "active" : ""}`} onClick={()=>{setCurrentPage("artists");setPlayerFolded(true)}}>Artists</div>
        </div>
    <div className="nav-search-wrapper">
    <div className="nav-searchbar">
    <input className='nav-search' type='text' onChange={(e) => {setSearch(`${e.target.value}`)}}/>
        <div className="nav-search-start">Search</div>
    </div>
    <div className={`nav-search-results ${!search ? "hidden" : ""}`}>
        {searchResults && searchResults.tracks ? (searchResults.tracks.results.map(song=>(
           <div className={`playlist-song ${song.id === currentSong.id ? `song-current ${isplaying ? "" : "paused"}` : ""}`} style={{opacity:`${song.available ? "1" : "0.8"}`}} key = {song.id} onClick={()=>{song.available ? handleSongClick(song):alert("Track unavailable")}}>
           <div className="play-button">
              <div className='playlist-song-state'>{song.id !== currentSong.id ? <div id = "play"><BsPlayFill/></div>: isplaying ? <div id="listening"><BsMusicNote/></div> : <div id = "pause"><BsFillPauseFill/></div>}</div>
           </div>
           <div className='playlist-song-image'>     
           <img src={song.ogImage ? `http://${song.ogImage.substring(0, song.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
           </div>
           <div className='playlist-song-title' style={{textDecoration:`${song.available ? "none" : "line-through"}`}}>
           {song.artists.length !== 0 ? song.artists[0].name + " - " + song.title : song.title}
           </div>
       </div>
        ))):(<></>)}

         {searchResults && searchResults.playlists ? (searchResults.playlists.results.map(playlist=>(
           <div className="playlist-card" key={playlist.playlistUuid} onClick={()=>{setCurrentPlaylist(playlist);console.log(playlist)}}>
           <div className="playlist-card-image">
               <img src="https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png" alt=""></img>
               <div className="playlist-card-desc">{playlist.title}</div>
               <div className="playlist-card-length">{playlist.trackCount}</div>
               <div className="playlist-card-play">
                   
               </div>
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


