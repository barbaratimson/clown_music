import React, { Children, useEffect, useRef, useState } from 'react';
import {BsRepeat1,BsShuffle, BsPlayFill, BsMusicNote, BsFillPauseFill} from 'react-icons/bs';
import {RiPlayLine, RiPauseFill, RiSkipBackLine, RiSkipForwardLine, RiArrowUpDoubleLine, RiPlayList2Fill, RiHeartLine, RiHeartFill} from 'react-icons/ri'
import Artist from './Artist';
import { usePalette } from 'react-palette'
import axios  from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSong } from '../store/trackSlice';

const link = process.env.REACT_APP_YMAPI_LINK
let volumeMultiplier = 0.5

const Player = ({isplaying, setArtist, likedSongs, setViewedPlaylist,setActive,  playerFolded, setPlayerFolded, children, setisplaying, prevSong, currentSongs, audioVolume, setAudioVolume,isSongLoading, setIsSongLoading, audioElem,setPrevSong, setCurrentPage})=> {
  const [playerRepeat,setPlayerRepeat] = useState(localStorage.getItem("playerRepeat") === "true" ? true : false)
  const [playerRandom,setPlayerRandom] = useState(localStorage.getItem("playerRandom") === "true" ? true : false)
  const [deviceType, setDeviceType] = useState("");
  const [similarTracks, setSimilarTracks] = useState("");
  const [buffered,setBuffered] = useState(0)
  const [position,setPosition] = useState(0)
  
  
  const currentPlaylist = useSelector(state => state.currentPlaylist.currentPlaylist)   
  const currentSong = useSelector(state => state.currentSong.currentSong) 
  const dispatch = useDispatch();
  const setCurrentSong = (song) => dispatch(changeCurrentSong(song))


  const clickRef = useRef();
  const ChangeVolume = (e) =>  {
    let volume = parseFloat(e.target.value/100)
    setAudioVolume(volume)
    localStorage.setItem("player_volume",volume)
  }

  const checkWidth = (e)=>
  {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = offset / width * 100;
    let currentTime = divprogress / 100 * audioElem.current.duration

    if (audioElem.current.currentTime !== 0) {
        audioElem.current.currentTime=currentTime
    }

  }
  const skipBack = ()=>
  {   
    if (!isSongLoading){
      if (playerRepeat && audioElem.current.currentTime === currentSong.duration){ 
        audioElem.current.currentTime = 0
        audioElem.current.play()
      } else {
        audioElem.current.src = ""
        setCurrentSong(prevSong)
      }
  }
}


    const skiptoNext = ()=>
  {  
    if (!isSongLoading){
    if (playerRepeat && audioElem.current.currentTime === currentSong.duration){ 
      audioElem.current.currentTime = 0
      audioElem.current.play()
    } else if (playerRandom) {
      setPrevSong(currentSong)
      audioElem.current.src = ""
           let randomSong = ()  => (Math.random() * (currentSongs.length - 0 + 1) ) << 0
      let newSongId = randomSong()
      if (currentSong.id === currentSongs[newSongId].id) {
        setCurrentSong(currentSongs[randomSong()])
    } else {
      setCurrentSong(currentSongs[newSongId])
    }
   }else if (!isSongLoading){
     const index = currentSongs.findIndex(x=>x.title === currentSong.title);
     setPrevSong(currentSong)
     audioElem.current.src = ""
    if (index === currentSongs.length-1)
    { 
      setCurrentSong(currentSongs[0])
    }
    else
    {
      setCurrentSong(currentSongs[index + 1])
    }
   }
  }
  }

  const fetchSimilarTracks = async (id) => {
    try {
      const response = await axios.get(
        `${link}/ya/tracks/${id}/similar`,);
      return response.data.similarTracks
    } catch (err) {
      console.error('Ошибка при получении списка треков:', err);
      console.log(err)
    }
};

const likeSong = async (song) => {
  try {
    const response = await axios.post(
      `${link}/ya/likeTracks/${267472538}/${song.id}`,);
      return response.data
  } catch (err) {
    console.error('Ошибка при получении списка треков:', err);
    console.log(err)
  }
};

const dislikeSong = async (song) => {
try {
  const response = await axios.post(
    `${link}/ya/dislikeTracks/${267472538}/${song.id}`,);
  return response.data
} catch (err) {
  console.error('Ошибка при получении списка треков:', err);
  console.log(err)
}
};




  const onPlaying = (e) => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    setPosition(ct / duration * 100)
    setBuffered(getBuffered())
  }
  

  const handleKeyPress = (e) => {
   if (e.key === " " && e.srcElement.tagName !== "INPUT"){
     e.preventDefault()
     !isplaying ? audioElem.current.play() : audioElem.current.pause()
     }
  }

  const getBuffered = () => {
    if (audioElem.current.duration > 0) {
        if (
          audioElem.current.buffered.start(audioElem.current.buffered.length - 1) < audioElem.current.currentTime
        ) {
            return (audioElem.current.buffered.end(audioElem.current.buffered.length-1)/audioElem.current.duration)*100
        }
  }
}

  

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
      )
    ) {
      setDeviceType("Mobile");
      audioVolume = 1
      setPlayerFolded(false)
    } else {
      setDeviceType("Desktop");
    }

  }, []);


  useEffect(() => {
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      skipBack()
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      skiptoNext()
    });

    navigator.mediaSession.setActionHandler("seekto", (e) => {
      audioElem.current.currentTime = e.seekTime
    });
  },[currentSongs]);

  useEffect(()=>{
    audioElem.current.volume = audioVolume*volumeMultiplier;
  },[audioVolume])

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return ()=> window.removeEventListener('keypress',handleKeyPress)
  });

  useEffect(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist:currentSong.artists && currentSong.artists.length > 0 ? currentSong.artists[0].name : "",
      artwork: [
        {
          src: currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/300x300` : "",
          sizes: "512x512",
          type: "image/png",
        },
      ]
    })

      audioElem.current.play()
      .catch(e=>e.code === 9 ? skiptoNext() : console.warn(e))

  //     const handleSimilarTracks = async (song) => {  
  //       setSimilarTracks(await fetchSimilarTracks(song.id))
  //       console.log(await fetchSimilarTracks(song.id))
  // }
  // handleSimilarTracks(currentSong)
  }, [currentSong.url || currentSong.title])

  useEffect(() => {
    localStorage.setItem("lastPlayedTrack",JSON.stringify(currentSong))
  },[currentSong])


  useEffect(() => {
    localStorage.setItem("playerRandom",playerRandom)
  }, [playerRandom])

  useEffect(() => {
    localStorage.setItem("playerRepeat",playerRepeat)
  }, [playerRepeat])


  return (
    <div>
    <div className={`${playerFolded ? "player-folded" : "player"} ${isplaying ? "active" : ""}`}>
      <div className={`player-image-section ${playerFolded ? "folded" : ""}`}>
      <div className={`image`}>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt="" onClick={()=>{!isplaying ? audioElem.current.play() : audioElem.current.pause()}}></img>
      </div>
      <div className={`player-track-info`}>
      <div className='player-current-playlist'>
        <div>Currently playing:</div>
        <div className='player-current-playlist-title' onClick={()=>{setViewedPlaylist(currentPlaylist);setActive(true)}}>{currentPlaylist.title}</div>
        </div>
        <div className='player-track-title'>{currentSong.title} </div>
        <div className='player-track-artists'>
        {currentSong.artists ? currentSong.artists.map(artist=>(
           <div className='player-track-artist' key={artist.name} onClick={()=>{setArtist(artist.name);setCurrentPage("artists");setPlayerFolded(true)}}>{artist.name}</div>
        )):(null)}
      </div>
      <div className='playlist-song-actions'>
                  {!likedSongs.find((elem) => String(elem.id) === String(currentSong.id)) ? (
                  <div className='playlist-song-like-button'  onClick={()=>{likeSong(currentSong)}}><RiHeartLine/></div>
                  ): (
                    <div className='playlist-song-like-button'  onClick={()=>{dislikeSong(currentSong)}}><RiHeartFill/></div>
                  )
                  }
                 </div>
        </div>
      </div>
            <div className={`player-controls-section  ${playerFolded ? "folded" : ""}`}> 
      <div className={`controls ${playerFolded ? "folded" : ""}`}>
        <RiSkipBackLine style = {{display:`${currentSongs ? "flex" : "none"}`}} className='btn_action' onClick={skipBack}/>
        {isplaying ? <RiPauseFill className='btn_action pp' onClick={()=>{audioElem.current.pause()}}/> : <RiPlayLine className='btn_action pp' onClick={()=>{audioElem.current.play()}}/>}
        <RiSkipForwardLine style = {{display:`${currentSongs  ? "flex" : "none"}`}} className='btn_action' onClick={skiptoNext}/>  
      </div>
      
      <div className={`player-image-section-folded ${!playerFolded ? "not-active" : ""} `}>
      <div className={`image-folded`}>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/100x100` : ""} loading= "lazy" alt="" onClick={()=>{!isplaying ? audioElem.current.play() : audioElem.current.pause()}}></img>
      </div>
      <div className={`player-track-info-folded`}>
        <div className='player-track-title-folded'>{currentSong.title} </div>
        <div className='player-track-artists'>
        {currentSong.artists ? currentSong.artists.map(artist=>(
           <div className='player-track-artists-folded' key={artist.name} onClick={()=>{setArtist(artist.name);setCurrentPage("artists");setPlayerFolded(true)}}>{artist.name}</div>
        )):(null)}
      </div>
        {/* <div className='player-track-artists-folded' onClick={()=>{setArtist(currentSong.artists[0].name);setCurrentPage("artists")}}>{currentSong.artists && currentSong.artists.length !== 0 ? currentSong.artists[0].name :  ""}</div> */}
      </div>
      {/* <div className='player-show-full' onClick={()=>{setPlayerFolded(false)}}>
          <RiPlayList2Fill/>
      </div> */}
      </div>
        
      <div className='playing-controls'>
        {playerFolded ? (<RiPlayList2Fill style={{color:"#ddd",fontSize:"30px"}} onClick={()=>{setPlayerFolded(false)}}/>) : (null) }
        <BsRepeat1  className={`loop-track ${playerRepeat ? "active" : ""}`} onClick={()=>{setPlayerRepeat(!playerRepeat)}}/>
        <BsShuffle className={`play-random ${playerRandom ? "active" : ""}`} onClick={()=>{setPlayerRandom(!playerRandom)}}/>
      </div>
      <div className='audio-volume-container'>    
            <div className='audio-volume'>
            <input type="range" min={0} max={100} value={audioVolume*100} onChange={(e)=>ChangeVolume(e)}></input>
            <progress value={audioVolume*100} max="100"></progress>
            </div>
        </div> 
      </div>
      <div className={`navigation_wrapper ${isSongLoading ? "loading" : ""} ${playerFolded ? "folded" : ""}`} onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${position+"%"}`}}></div>
          <div className="buffer-bar" style={{width: `${!isSongLoading ? buffered+"%" : 0}`}}></div>
      </div>
      </div>

      <audio preload={"auto"} autobuffer={"true"} crossOrigin="anonymous"
      src={currentSong.url} ref={audioElem}
       onLoadStart={()=>{setIsSongLoading(true)}} 
        onError={(e)=>{setisplaying(false);setIsSongLoading(false)}}
         onCanPlay={()=>{setIsSongLoading(false)}} onPlay={() =>{setisplaying(true)}}
          onPause={()=>{setisplaying(false)}} onEnded={(e)=>{skiptoNext(e)}} onTimeUpdate={onPlaying}></audio>   

      <div className={`player-song-info-section ${playerFolded ? "folded" : ""}`}>
        {children}
      </div> 
      
      </div>
      
  )
}

export default Player