import React, { useEffect,useState} from 'react';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { RiPlayLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { changeCurrentPage } from '../store/currentPageSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const MyTracks = ({setPlayerFolded, audioElem,setPrevSong}) => {

    const [isLoading, setIsLoading] = useState(false);
    
    const [userTracks,setUserTracks] = useState()

    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const likedSongs = useSelector(state => state.likedSongs.likedSongs)   
    
    const dispatch = useDispatch();
    const setCurrentSong = (song) => dispatch(changeCurrentSong(song)) 
    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const fetchYaMudicSongs = async () => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/myTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
              setUserTracks(response.data)
              setIsLoading(false)
          } catch (err) {   
            console.error('Ошибка при получении списка треков:', err);
          }
      };

      function msToTime(duration) {
          var seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + "h:" + minutes + "m:" + seconds + "s";
      }
  
      useEffect(()=>{
        fetchYaMudicSongs()
      },[likedSongs])

      useEffect(()=>{
          fetchYaMudicSongs()
      },[])

      if (isLoading) return <Loader></Loader>

    return (
      <div>
           {userTracks? (
                <div>
                  <div className='artist-info-section'>
                    <div className='main-image-wrapper'>  
                    <div className='playlist-play-button heart' onClick={()=>{setCurrentPlaylist(userTracks);setCurrentSong(userTracks.tracks[0].track);setPlayerFolded(false);setCurrentPage("currentPlaylist")}}><RiPlayLine/></div>
                <img className="image heart" src={userTracks.ogImage ? `http://${userTracks.ogImage.substring(0, userTracks.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                    </div>
                <div className='artist-info'>
                <div className='artist-name'>{userTracks.title}</div>
                <div className='user-tracks-secondary'>Tracks: {userTracks.trackCount}</div>
                <div className='user-tracks-secondary'>Duration {msToTime(userTracks.durationMs)}</div>
                </div>              
                  </div>
                  <div className='chart-songs-wrapper my-tracks'>
                {userTracks.tracks.length !== 0 ? userTracks.tracks.map((song)=> song.track.available ? (
                                    <Track key={song.id} playlist={userTracks} setPlayerFolded={setPlayerFolded} setPrevSong={setPrevSong} audioElem={audioElem} song = {song.track}/>
                ):null):(
                    <div className="empty-playlist">
                        <div className="playlist-song-empty">Your current playlist is empty</div>
                    </div>
                )}
                </div>   
            </div>
            ):null}
           
         </div>
    );

};

export default MyTracks;