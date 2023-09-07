import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
import Track from './Track';

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({currentPlaylist,audioElem,setPrevSong, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setisplaying,setCurrentSongs,currentSongs, isSongLoading,setIsSongLoading, prevSong}) => {
  const [isLoading,setIsLoading] = useState()
  const [likeButtonHover,setLikeButtonHover] = useState(false)
    const handleSongClick = async (song) => {
        if (song.id === currentSong.id && isplaying){
            audioElem.current.pause()
        } else if (song.id !== currentSong.id) {
          audioElem.current.currentTime = 0
          currentSong.progress = 0
          setPrevSong(currentSong)
          audioElem.current.src = ' '
            setCurrentSong(song)
        } else{
            audioElem.current.play().catch(err=>console.error(err))
      }
    }

    const fetchPlaylistSongs = async (userId,kind) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/playlist/tracks/${userId}/${kind}`,);
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
              `${link}/ya/tracks/${id}`,);
                return response.data
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

    
    const fetchYaSongSupplement = async (id) => {
      try {
        const response = await axios.get(
          `${link}/ya/tracks/${id}/supplement`,);
        return response.data
      } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
      }
  };

  const likeSong = async (song) => {
    try {
      const response = await axios.get(
        `${link}/ya/likeTracks/${267472538}/${song.id}`,);
        return response.data
    } catch (err) {
      console.error('Ошибка при получении списка треков:', err);
      console.log(err)
    }
};

const dislikeSong = async (song) => {
  try {
    const response = await axios.get(
      `${link}/ya/dislikeTracks/${267472538}/${song.id}`,);
    return response.data
  } catch (err) {
    console.error('Ошибка при получении списка треков:', err);
    console.log(err)
  }
};


    function millisToMinutesAndSeconds(millis) {
      if (millis){
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      } else {
        return '-:-'
      }
    }

    useEffect(()=>{
        const handleTrackChange = async (song) => {  
          setIsSongLoading(true)
                  setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
                  console.log(await fetchYaSongSupplement(currentSong.id))
    }
    handleTrackChange(currentSong)
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

      if (isLoading) return <div style={{width:'400px',height:'600px',display:"flex",justifyContent:'center',alignItems:'center',fontSize:'40px',color:'white'}}>Загрузка</div>

    return (
        <div className={`playlist-songs-list`}>
              <div className='playlist-songs-container'>
                        {currentSongs ? (currentSongs.map((song) => (
                          <Track key={song.id} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
            ))):(" ")}
        
            </div>
            </div>
    );

};

export default Playlist;