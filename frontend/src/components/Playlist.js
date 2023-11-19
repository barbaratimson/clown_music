import React, { useEffect,useState,useRef } from 'react';
import { json, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
import Track from './Track';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentSongs } from '../store/currentSongsSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({audioElem, setPlayerFolded, setArtist, setPrevSong, isplaying, isSongLoading,setIsSongLoading}) => {
  const dispatch = useDispatch();

  const [isTracksLoading,setIsTracksLoading] = useState()

  const currentSongs = useSelector(state => state.currentSongs.currentSongs)   
  const setCurrentSongs = (playlist) => dispatch(changeCurrentSongs(playlist))
  const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
  const currentSong = useSelector(state => state.currentSong.currentSong) 
  const setCurrentSong = (song) => dispatch(changeCurrentSong(song))

    const fetchPlaylistSongs = async (userId,kind) => {
      setIsTracksLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/playlist/tracks/${userId}/${kind}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
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
              `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
                return response.data
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
      };

      const fetchYaSongInfo = async (id) => {
        try {
          const response = await axios.get(
            `${link}/ya/trackinfo/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
          return response.data
        } catch (err) {
          console.error('Ошибка при получении списка треков:', err);
          console.log(err)
        }
    };

    
    const fetchYaSongSupplement = async (id) => {
      try {
        const response = await axios.get(
          `${link}/ya/tracks/${id}/supplement`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
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
          await fetchPlaylistSongs(currentPlaylist.kind,currentPlaylist.owner.uid)
        } else if (currentPlaylist.type ==="album"){
          setCurrentSongs(currentPlaylist.tracks)
        }
      }
      handleFeed()
      },[currentPlaylist])

      if (isTracksLoading) return <Loader></Loader>

    return (
              <div className='playlist-songs-container'>
                        {currentSongs ? (currentSongs.map((song) => song?.available ? (
                          <Track setArtist={setArtist} setPlayerFolded={setPlayerFolded} key={song.id} playlist={currentPlaylist}  setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
            ):null
            )):null}
        
            </div>
    );

};

export default Playlist;