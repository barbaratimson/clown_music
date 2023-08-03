import React, { Component, useEffect, useRef, useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill, BsRepeat1,BsShuffle} from 'react-icons/bs';
let volumeMultiplier = 0.35
const Player = ({isplaying, setisplaying, audioVolume, setAudioVolume, currentSong, setCurrentSong, currentPlaylist,setSongs,isSongLoading,setIsSongLoading,setPrevSong, prevSong})=> {
  const [playerLoading, setPlayerLoading] = useState(false)
  const [playerRepeat,setPlayerRepeat] = useState(localStorage.getItem("playerRepeat"))
  // const [playerRandom,setPlayerRandom] = useState(localStorage.getItem("playerRandom"))
    const [playerRandom,setPlayerRandom] = useState(false)
    const audioElem = useRef()
  const clickRef = useRef();

  const PlayPause = ()=>
  {
    setisplaying(!isplaying);

  }

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
    let currentTime = divprogress / 100 * currentSong.length

    if (audioElem.current.currentTime !== 0) {
        audioElem.current.currentTime=currentTime
    }

  }
  const skipBack = ()=>
  {
    if (audioElem.current.currentTime>=5){
      audioElem.current.currentTime=0
    } else if (playerRandom) {
       let randomSong = ()  => (Math.random() * (currentPlaylist.length - 0 + 1) ) << 0
      let songId = randomSong()
      if (currentPlaylist[songId].id === currentSong.id) {
        songId++
      } else {
      setCurrentSong(currentPlaylist[songId])
      }
    }else{
      const index = currentPlaylist.findIndex(x=>x.title === currentSong.title);
      if (index === 0)
      {
        setCurrentSong(currentPlaylist[currentPlaylist.length - 1])
      }
      else
      {
        setCurrentSong(currentPlaylist[index - 1])
      }
      if (!playerLoading) {
        audioElem.current.currentTime = 0;
      }
    }
  }

    const skiptoNext = ()=>
  {  
    if (playerRepeat){ 
      audioElem.current.play()
    } else if (playerRandom) {
      let randomSong = ()  => (Math.random() * (currentPlaylist.length - 0 + 1) ) << 0
     let songId = randomSong()
     if (currentPlaylist[songId].id === currentSong.id) {
       songId=randomSong()
     } else {
     setCurrentSong(currentPlaylist[songId])
     }
   }else{
     const index = currentPlaylist.findIndex(x=>x.title === currentSong.title);
    if (index === currentPlaylist.length-1)
    { 
      setCurrentSong(currentPlaylist[0])
    }
    else
    {
      setCurrentSong(currentPlaylist[index + 1])
    }
     if (!playerLoading) {
       audioElem.current.currentTime = 0;
     }
   }

  }

  const onPlaying = (e) => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })
    }


  const handleKeyPress = (e) => {
    e.preventDefault()
    if (e.key === " "){
        PlayPause()
      }
  }


  useEffect(()=>{
    audioElem.current.volume = audioVolume*volumeMultiplier;
  },[audioVolume])

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return ()=> window.removeEventListener('keypress',handleKeyPress)
  });

  useEffect(() => {
    if (isplaying && !playerLoading){
            audioElem.current.play()
            setisplaying(true)
    }
  }, [currentSong.url,currentSong.title])

  useEffect(()=>{
    console.log("fs")
  },[currentPlaylist])

  useEffect(() => {
    setPrevSong(currentSong)
    localStorage.setItem("lastPlayedTrack",JSON.stringify(currentSong))
  }, [currentSong])

  useEffect(()=>{
    localStorage.setItem("playerRandom",playerRandom)
  },[playerRandom])

  useEffect(()=>{
    localStorage.setItem("playerRandom",playerRepeat)
  },[playerRepeat]) 


  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();

      if (currentSong.progress){ // Надо над этим покумекать
        audioElem.current.currentTime = currentSong.progress/100 * currentSong.length
      }

    }
    else {
      audioElem.current.pause();
    }
  }, [isplaying])

  return (
    <div className={`player ${isplaying ? "active" : ""}`}>
              <div className="controls">
        <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
        <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext}/>  
      </div>
      <div className="title">
        <p>{currentSong.artists[0] ? currentSong.artists[0].name + " - " + currentSong.title : ""}</p>
      </div>
      <div className="navigation">
      <div className={`navigation_wrapper ${isSongLoading ? "loading" : ""}`} onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div>
      <audio src={currentSong.url} ref={audioElem} onLoadStart={()=>{console.log("Гружу");setIsSongLoading(true)}} onError={(e)=>console.log(e)} onCanPlay={()=>{console.log("Могу ебашить");setIsSongLoading(false)}} onEnded={(e)=>{skiptoNext(e)}} onTimeUpdate={onPlaying} />
      <div className='playing-controls'>
        <BsRepeat1 className={`loop-track ${playerRepeat ? "active" : ""}`} onClick={()=>{setPlayerRepeat(!playerRepeat)}}/>
        <BsShuffle className={`play-random ${playerRandom ? "active" : ""}`} onClick={()=>{setPlayerRandom(!playerRandom)}}/>
      </div>
      <div className='audio-volume-container'>    
            <div className='audio-volume'>
            <input type="range" min={0} max={100} value={audioVolume*100} onChange={(e)=>ChangeVolume(e)}></input>
            <progress value={audioVolume*100} max="100"></progress>
            </div>
        </div>
        </div>
  
  )
}

export default Player