import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaylistsFeed from './PlaylistsFeed';

const link = process.env.REACT_APP_YMAPI_LINK

const Artist = ({artist,setCurrentPage,setPlayerFolded}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [artistResult,setArtistResult] = useState()
    const fetchArtist = async (artistName) => {
        setIsLoading(true)
          try {
            const response = await axios.get(
              `${link}/ya/search/artists/${artistName}`);
              setArtistResult(response.data.artists.results[0])
              setIsLoading(false)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
          }
      };
      
      useEffect(()=>{
        fetchArtist(artist)
      },[])

      if (isLoading) return <div style={{width:'400px',height:'600px',display:"flex",justifyContent:'center',alignItems:'center',fontSize:'40px',color:'white'}}>Загрузка</div>

    return (
      <div className='playlists-container'>
            {console.log(artistResult)}
         </div>
    );

};

export default Artist;