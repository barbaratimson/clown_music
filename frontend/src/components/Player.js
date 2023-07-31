import React, { Component, useEffect, useRef, useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';

let volumeMultiplier = 0.35
const Player = ({isplaying, setisplaying, audioVolume, setAudioVolume, currentSong, setCurrentSong, songs})=> {
  const [playerCanPlay,setPlayerCanPlay] = useState(false)
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
    const index = songs.findIndex(x=>x.title === currentSong.title);
    if (index === 0)
    {
      setCurrentSong(songs[songs.length - 1])
    }
    else
    {
      setCurrentSong(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
  }


  const skiptoNext = ()=>
  { 
    const index = songs.findIndex(x=>x.title === currentSong.title);
    if (index === songs.length-1)
    {
      setCurrentSong(songs[0])
    }
    else
    {
      setCurrentSong(songs[index + 1])
    }
    audioElem.current.currentTime = 0;
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
    if (isplaying){
            audioElem.current.play()
            setisplaying(true)
    } 
  }, [currentSong.url,currentSong.title])

  useEffect(() => {
    localStorage.setItem("lastPlayedTrack",JSON.stringify(currentSong))
  }, [currentSong])



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
        <p>{currentSong.title}</p>
      </div>
      <div className="navigation">
        <div className="navigation_wrapper" onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div>
      <audio src={currentSong.url} ref={audioElem} onCanPlay={()=>{console.log("Могу ебашить");setPlayerCanPlay(true)}} onEnded={skiptoNext} onTimeUpdate={onPlaying} />
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
