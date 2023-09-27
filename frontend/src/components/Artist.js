import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaylistsFeed from './PlaylistsFeed';
import Track from './Track';
import Loader from './Loader';
import { RiPlayLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';
import { changeCurrentPlaylist } from '../store/currentPlaylistSlice';
import { changeCurrentPage } from '../store/currentPageSlice';

const link = process.env.REACT_APP_YMAPI_LINK

const Artist = ({artist,setViewedPlaylist, setActive, audioElem,setPrevSong, likedSongs, setLikedSongs,isplaying,isSongLoading,setIsSongLoading}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [artistResult,setArtistResult] = useState()

    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))

    const setCurrentPlaylist = (playlist) => dispatch(changeCurrentPlaylist(playlist))

    const dispatch = useDispatch();

    const fetchArtist = async (artistName) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/artists/${encodeURIComponent(artistName)}`);
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
                                    <Track key={song.id} playlist={artistResult.popularTracks} setPrevSong={setPrevSong} isplaying = {isplaying} audioElem={audioElem} song = {song} likedSongs={likedSongs} setLikedSongs={setLikedSongs} setIsSongLoading={setIsSongLoading} isSongLoading={isSongLoading}></Track>
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