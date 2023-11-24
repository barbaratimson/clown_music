import React, { useEffect,useState,useRef } from 'react';
import { json, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlay, BsPlayFill } from 'react-icons/bs';
import Track from './Track';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentSongs } from '../store/currentSongsSlice';
import {useTraceUpdate} from "../utils/hooks/useTraceUpdate";
import {changeSongLoading} from "../store/isSongLoadingSlice";

const link = process.env.REACT_APP_YMAPI_LINK



const Playlist = ({audioElem, setPrevSong}) => {
  const dispatch = useDispatch();

  const [isTracksLoading,setIsTracksLoading] = useState()

  const currentSongs = useSelector(state => state.currentSongs.currentSongs)   
  const setCurrentSongs = (playlist) => dispatch(changeCurrentSongs(playlist))
  const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
  const currentSong = useSelector(state => state.currentSong.currentSong) 
  const setCurrentSong = (song) => dispatch(changeCurrentSong(song))
  const setIsSongLoading = (state) => dispatch(changeSongLoading(state))

  useTraceUpdate({audioElem, setPrevSong,currentSongs,currentPlaylist,currentSong})
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

    //TODO: Move this handler to track onClick event to prevent re-rendering

    useEffect(()=>{
        const handleTrackChange = async (song) => {
          setIsSongLoading(true)
                  setCurrentSong({...song,url:await fetchYaSongLink(song.id)})
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
                {console.log("Playlist rendered")}
                        {currentSongs && currentSongs.length !== 0 ? (currentSongs.map((song) => song?.available ? (
                          <Track key={song.id} setPrevSong={setPrevSong} audioElem={audioElem} song = {song}></Track>
            ):null
            )):(
                <>
                <div className="playlist-song-empty">Your current playlist is empty</div>
                </>
                        )}

            </div>
    );

};

export default Playlist;