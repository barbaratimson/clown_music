import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Playlist = ({playlistDataYa,setPlaylistDataYa,currentSong, setCurrentSong,isplaying,setisplaying, setIsSongLoading,setCurrentPlaylist, audioElem, prevSong}) => {
    const [isLoading,setIsLoading]= useState(false)

            const handleSongClick = async (song) => {
            if (song.id === currentSong.id && isplaying){
                setisplaying(false)
            } else if (song.id !== currentSong.id) {
                setCurrentSong(song)
                setisplaying(true)
            } else {
                setisplaying(true)
            }
        }

    const fetchYaSongLink = async (id) => {
        setIsSongLoading(true)
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/tracks/${id}`,);
            return response.data
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
            if (err.code === "!-Error code here-!"){
                alert("!-Error code here-!")
            } else {
                alert("Server unavailable")
            }
          }
      };
    

    const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              'http://localhost:5051/ya/myTracks',);
              setPlaylistDataYa(response.data)
              setCurrentPlaylist(response.data)
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
            if (err.code === "!-Error code here-!"){
                alert("!-Error code here-!")
            } else {
                alert("Server unavailable")
            }
          }
      };
    
      useEffect(()=>{
        fetchYaMudicSongs()
      },[])

      useEffect(()=>{
        if (isplaying){
            setisplaying(false)
        const handleTrackChange = async (song) => {
            let link = await fetchYaSongLink(song.id)
            if (!link){
                setCurrentSong(prevSong)
            } else {
                setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
            }
        }
        handleTrackChange(currentSong)
    }
    console.log(currentSong)
      },[currentSong.id])


    if (isLoading) return <div>Загрузка</div>

    return (
        <div className='playlist-songs-list'>
            <div className='playlist-header'>
                Яндекс Музыка
            </div>
            {playlistDataYa.length !== 0 ? (
                <div>     
            {playlistDataYa.map((song) => (
                 <div className={`playlist-song ${song.title === currentSong.title ? `song-current ${isplaying ? "" : "paused"}` : ""}`} key = {song.id} onClick={()=>{handleSongClick(song)}}>
                 <div className="play-button">
                    <div className='playlist-song-state'>{song.title !== currentSong.title ? "PLAY": `${isplaying ? "LISTENING" : "PAUSE"}`}</div>
                 </div>
                 <div className='playlist-song-title'>
                 {song.artists[0].name + " - " + song.title}
                 </div>
             </div>
             
            ))}
            </div>
            ):
            (
                <h1>LOADING</h1>
            )
            }
        </div>
    );

};

export default Playlist;