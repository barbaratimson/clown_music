import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
const Playlist = ({currentPlaylist,audioElem, currentSong, setCurrentSong,isplaying,setisplaying,setCurrentSongs,currentSongs, isSongLoading, prevSong}) => {
  const [isLoading,setIsLoading] = useState()
    const handleSongClick = async (song) => {
        if (song.id === currentSong.id && isplaying){
            setisplaying(false)
        } else if (!isSongLoading && song.id !== currentSong.id) {
            setCurrentSong(song)
            setisplaying(true)
        } else {
            setisplaying(true)
      }
    }

    const fetchPlaylistSongs = async (userId,kind) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/playlist/tracks/${userId}/${kind}`,);
              setCurrentSongs(response.data)
              setIsLoading(false)
              console.log(response)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };


    const fetchYaSongLink = async (id) => {
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/tracks/${id}`,);
            return response.data
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };

      const fetchYaSongInfo = async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:5051/ya/trackinfo/${id}`,);
          return response.data
        } catch (err) {
          console.error('Ошибка при получении списка треков:', err);
          console.log(err)
        }
    };

    useEffect(()=>{
        if (isplaying){
        const handleTrackChange = async (song) => {
                setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
        }
        handleTrackChange(currentSong)
    }
      },[currentSong.id])

      useEffect(()=>{
        const handleFeed = async () => {
        if (currentPlaylist && currentPlaylist.tracks && currentPlaylist.generatedPlaylistType){
         let result = await Promise.all(currentPlaylist.tracks.map(async (track) => {
            return await fetchYaSongInfo(track.id)
        }));
        setCurrentSongs(result)

        } else if (currentPlaylist.owner) {
          fetchPlaylistSongs(currentPlaylist.owner.uid,currentPlaylist.kind)
        }
      }
      handleFeed()
      },[currentPlaylist])

      if (isLoading) return <div>Загрузка</div>

    return (
        <div className='playlist-songs-list'>

                          {/* <div className='playlist-header'>
                {currentPlaylist ? currentPlaylist.title : ""}
            </div> */}
              <div className='playlist-songs-container'>
            {currentSongs ? (currentSongs.map((song) => (
              <div className={`playlist-song ${song.id === currentSong.id ? `song-current ${isplaying ? "" : "paused"}` : ""}`} style={{opacity:`${song.available ? "1" : "0.8"}`}} key = {song.id} onClick={()=>{song.available && !isSongLoading ? handleSongClick(song) : console.log("Error ")}}>
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
            ))):(" ")}
        
            </div>
            </div>
    );

};

export default Playlist;