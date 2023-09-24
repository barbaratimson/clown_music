import React, { useEffect,useState,useRef } from 'react';
import { json, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
import Track from './Track';
import Loader from './Loader';

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({currentPlaylist,audioElem, setCurrentPage, setPlayerFolded, setArtist, setPrevSong,setCurrentPlaylist, likedSongs, setLikedSongs, currentSong, setCurrentSong,isplaying,setisplaying,setCurrentSongs,currentSongs, isSongLoading,setIsSongLoading, prevSong}) => {
  const [isTracksLoading,setIsTracksLoading] = useState()
  const [likeButtonHover,setLikeButtonHover] = useState(false)

    const fetchPlaylistSongs = async (userId,kind) => {
      setIsTracksLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/playlist/tracks/${userId}/${kind}`,);
              setCurrentSongs(response.data)
              setIsTracksLoading(false)
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

    useEffect(()=>{
        const handleTrackChange = async (song) => {  
          setIsSongLoading(true)
                  setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
                  console.log(await fetchYaSongSupplement(currentSong.id))
    }
    handleTrackChange(currentSong)
      },[currentSong.id])
    

      useEffect(()=>{
        localStorage.setItem("prevPlaylist",JSON.stringify(currentPlaylist))
        const handleFeed = async () => {
        if (currentPlaylist && currentPlaylist.tracks && currentPlaylist.generatedPlaylistType){
          setIsTracksLoading(true)
         let result = await Promise.all(currentPlaylist.tracks.map(async (track) => {
            return await fetchYaSongInfo(track.id)
        }));
        setCurrentSongs(result)
        setIsTracksLoading(false)
        } else if (currentPlaylist.owner) {
          fetchPlaylistSongs(currentPlaylist.kind,currentPlaylist.owner.uid)
        } 
      }
      handleFeed()
      },[currentPlaylist])

      if (isTracksLoading) return <Loader></Loader>

    return (
              <div className='playlist-songs-container'>
                        {currentSongs ? (currentSongs.map((song) => song.available ? (
                          <Track setArtist={setArtist} setCurrentPage={setCurrentPage} setPlayerFolded={setPlayerFolded} key={song.id} playlist={currentPlaylist} setCurrentPlaylist={setCurrentPlaylist} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} setCurrentSong={setCurrentSong} setCurrentSongs={setCurrentSongs} currentPlaylist={currentPlaylist} currentSong={currentSong} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
            ):(null)
            )):(null)}
        
            </div>
    );

};

export default Playlist;