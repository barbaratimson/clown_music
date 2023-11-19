import React, { useEffect,useState} from 'react';
import axios from 'axios';
import Track from './Track';
import Loader from './Loader';
import { useDispatch} from 'react-redux';
import { changeCurrentPage } from '../store/currentPageSlice';
import { changeModalState } from '../store/modalSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Artist = ({artist,setViewedPlaylist, audioElem,setPrevSong,isplaying,isSongLoading,setIsSongLoading}) => {
  const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [artistResult,setArtistResult] = useState()

    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const setActive = (state) => dispatch(changeModalState(state))

    const fetchArtist = async (artistName) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/artists/${encodeURIComponent(artistName)}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
              setArtistResult(response.data)
              setIsLoading(false)
          } catch (err) {
            setIsLoading(false)
            setCurrentPage("currentPlaylist")
            console.error('Ошибка при получении списка треков:', err);
          }
      };


      useEffect(()=>{
          fetchArtist(artist)
      },[artist])

      if (isLoading) return <Loader></Loader>
    return (
      <div>   
            {artistResult? (
                <div>
                  <div className='artist-info-section'>
                <img className="image" src={artistResult.artist.ogImage ? `http://${artistResult.artist.ogImage.substring(0, artistResult.artist.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
                <div className='artist-info'>
                <div className='artist-name'>{artistResult.artist.name}</div>
                <div className='artist-genres'>{`${artistResult.artist.genres}`}</div>  
                </div>              
                  </div>
                  <div className='artist-titlebar'>Popular Tracks</div>
                  <div className='chart-songs-wrapper'>
                {artistResult.popularTracks.map((song)=>(
                                    <Track key={song.id} playlist={artistResult.popularTracks} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
                ))}
                </div>
                <div className='artist-titlebar'>Releases</div>
                <div className="playlists">           
                {artistResult.albums.map((playlist) => playlist.available ? ( 
                  <div className="playlist-card" key={playlist.playlistUuid} onClick={async ()=>{setViewedPlaylist({...playlist,type:"album"});setActive(true);console.log()}} >
                  <div className="playlist-card-image">
                  <img src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/200x200` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                  </div>
                  <div className='playlist-card-info'>
                      <div className="playlist-card-desc">{playlist.title}</div>
                      {/* <div className="playlist-card-length">{playlist.trackCount}</div> */}
                  </div>
              </div>
            ):(null))}  
             </div>
            </div>
            ):(null)}
          
         </div>
    );

};

export default Artist;