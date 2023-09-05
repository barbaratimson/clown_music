import React, { useEffect, useRef, useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill, BsRepeat1,BsShuffle, BsPlayFill, BsMusicNote, BsFillPauseFill} from 'react-icons/bs';
import AudioAnayzer from './AudioAnalyzer';
import axios  from 'axios';
const link = process.env.REACT_APP_YMAPI_LINK
let volumeMultiplier = 0.5
const Player = ({isplaying, setisplaying, prevSong, currentSongs, audioVolume, setAudioVolume, currentSong,isSongLoading, setIsSongLoading, audioElem, setCurrentSong,setPrevSong, setDominantColor, dominantColor})=> {
  const [playerRepeat,setPlayerRepeat] = useState(localStorage.getItem("playerRepeat") === "true" ? true : false)
  const [playerRandom,setPlayerRandom] = useState(localStorage.getItem("playerRandom") === "true" ? true : false)
  const [deviceType, setDeviceType] = useState("");
  const [similarTracks, setSimilarTracks] = useState("");


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
    let currentTime = divprogress / 100 * currentSong.duration

    if (audioElem.current.currentTime !== 0) {
        audioElem.current.currentTime=currentTime
    }

  }
  const skipBack = ()=>
  {   
    if (!isSongLoading){
      if (playerRepeat && audioElem.current.currentTime === currentSong.length){ 
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
    if (playerRepeat && audioElem.current.currentTime === currentSong.length){ 
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


  const onPlaying = (e) => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    const buffered = getBuffered()
    setCurrentSong({ ...currentSong, "position": ct / duration * 100, "duration": duration,"buffered":buffered})
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

      const handleSimilarTracks = async (song) => {  
        setSimilarTracks(await fetchSimilarTracks(song.id))
        console.log(await fetchSimilarTracks(song.id))
  }
  handleSimilarTracks(currentSong)
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
    <div className={`player ${isplaying ? "active" : ""}`}>
      <div className='player-image-section'>
      <div className='image'>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/200x200` : ""} loading= "lazy" alt=""></img>
      </div>
      <div className='player-track-info'>
        <div className='player-track-title'>{currentSong.title} </div>
        <div className='player-track-artists'>{currentSong.artists && currentSong.artists.length !== 0 ? currentSong.artists[0].name :  ""}</div>
      </div>
      <div className='second-image' onClick={()=>{!isplaying ? audioElem.current.play() : audioElem.current.pause()}}>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/800x800` : ""} loading= "lazy" alt=""></img>
      </div>
      </div>

      <div className='player-song-info-section'>
      {similarTracks ? (similarTracks.map((song) => (
              <div className={`playlist-song ${song.id === currentSong.id ? `song-current ${isplaying ? "" : "paused"}` : ""}`} style={{opacity:`${song.available ? "1" : "0.8"}`}} key = {song.id}>
                 <div className="play-button">
                    <div className='playlist-song-state'>{song.id !== currentSong.id ? <div id = "play"><BsPlayFill/></div>: isplaying ? <div id="listening"><BsMusicNote/></div> : <div id = "pause"><BsFillPauseFill/></div>}</div>
                 </div>
                 <div className='playlist-song-image'>      
                 <img src={song.ogImage ? `http://${song.ogImage.substring(0, song.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"} loading= "lazy" alt=""></img>
                 </div>
                 <div className='playlist-song-title' style={{textDecoration:`${song.available ? "none" : "line-through"}`}}>
                 {song.artists.length !== 0 ? song.artists[0].name + " - " + song.title : song.title}
                 </div>
                 <div className='playlist-song-duration'>
                    {/* {millisToMinutesAndSeconds(song.durationMs)} */}
                 </div>
             </div>
            ))):(" ")}
        
      </div>
      
      <div className='player-controls-section'>
      <div className="controls">
        <BsFillSkipStartCircleFill style = {{display:`${currentSongs ? "flex" : "none"}`}} className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={()=>{audioElem.current.pause()}}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={()=>{audioElem.current.play()}}/>}
        <BsFillSkipEndCircleFill style = {{display:`${currentSongs  ? "flex" : "none"}`}} className='btn_action' onClick={skiptoNext}/>  
      </div>
      <div className="title">
        {currentSong.artists && currentSong.artists.length !== 0 ? currentSong.artists[0].name + " - " + currentSong.title :  currentSong.title}
      </div>
      <div className={`navigation_wrapper ${isSongLoading ? "loading" : ""}`} onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.position+"%"}`}}></div>
          <div className="buffer-bar" style={{width: `${!isSongLoading ? currentSong.buffered+"%" : 0}`}}></div>
      </div>
      <audio preload={"auto"} crossOrigin="anonymous" onSeeked = {(e)=>{console.log(e)}} src={currentSong.url} ref={audioElem} onLoadStart={()=>{setIsSongLoading(true)}}  onError={(e)=>{setisplaying(false);setIsSongLoading(false)}} onCanPlay={()=>{setIsSongLoading(false)}} onPlay={() =>{setisplaying(true)}} onPause={()=>{setisplaying(false)}} onEnded={(e)=>{skiptoNext(e)}} onTimeUpdate={onPlaying}>

      </audio>
      <div className='playing-controls'>
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
              
      </div>
  )
}

export default Player