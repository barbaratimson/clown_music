import React, { useEffect, useRef, useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill, BsRepeat1,BsShuffle} from 'react-icons/bs';
import AudioAnayzer from './AudioAnalyzer';
let volumeMultiplier = 0.35
const Player = ({isplaying, setisplaying, currentSongs, audioVolume, setAudioVolume, currentSong,isSongLoading, setIsSongLoading, setCurrentSong,setPrevSong})=> {
  const audioElem = useRef()
  const [playerRepeat,setPlayerRepeat] = useState(false)
  const [playerRandom,setPlayerRandom] = useState(false)
  const [analyser,setAnalyzer] = useState()
  const [frequencyData,setfrequencyData] = useState()
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
       let randomSong = ()  => (Math.random() * (currentSongs.length - 0 + 1) ) << 0
      let songId = randomSong()
      if (currentSongs[songId].id === currentSong.id) {
        songId++
      } else {
      setCurrentSong(currentSongs[songId])
      }
    }else{
      audioElem.current.src = ""
      const index = currentSongs.findIndex(x=>x.title === currentSong.title);
      if (index === 0)
      {
        setCurrentSong(currentSongs[currentSongs.length - 1])
      }
      else
      {
        setCurrentSong(currentSongs[index - 1])
      }
    }
  }
    const skiptoNext = ()=>
  {  
    if (playerRepeat){ 
      audioElem.current.play()
    } else if (playerRandom) {
      let randomSong = ()  => (Math.random() * (currentSongs.length - 0 + 1) ) << 0
     let songId = randomSong()
     if (currentSongs[songId].id === currentSong.id) {
       songId=randomSong()
     } else {
     setCurrentSong(currentSongs[songId])
     }
   }else if (!isSongLoading){
    audioElem.current.src = ""
     const index = currentSongs.findIndex(x=>x.title === currentSong.title);
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

  const getAnalyzerInfo= () =>{
    if (analyser){
    let a = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(a)
    return a
    }
  }

  const onPlaying = (e) => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })
    }


  const handleKeyPress = (e) => {
    if (e.key === " "){
      e.preventDefault()
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
    if (isplaying && !isSongLoading){
            audioElem.current.play()
            setisplaying(true)
    }
  }, [currentSong.url,currentSong.title])

  useEffect(() => {
    setPrevSong(currentSong)
    localStorage.setItem("lastPlayedTrack",JSON.stringify(currentSong))
  }, [currentSong])


  useEffect(()=>{
    console.log(localStorage.getItem("playerRep"))
  },[playerRandom,playerRepeat])
  
  useEffect(()=>{
    let a = setTimeout(()=>{
      setfrequencyData(getAnalyzerInfo())
    },12)
    return ()=>clearTimeout(a)
  })


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
    // <div className={`player ${isplaying ? "active" : ""}`} style={{background:`linear-gradient(90deg, rgba(115,0,0,1) ${frequencyData? frequencyData[0]/10-30:"100"}%, #0f0f0f ${frequencyData? frequencyData[0]/3-30 :"100"}%)`}}>
    <div className={`player ${isplaying ? "active" : ""}`} style={{background:`linear-gradient(150deg, rgba(115,0,0,1) ${frequencyData? frequencyData[0]/10-40:"100"}%, rgba(0,0,0,1) ${frequencyData? frequencyData[0]/3-30 :"100"}%)`}}>
              <div className="controls">
        <BsFillSkipStartCircleFill style = {{display:`${currentSongs ? "flex" : "none"}`}} className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause}/>}
        <BsFillSkipEndCircleFill style = {{display:`${currentSongs  ? "flex" : "none"}`}} className='btn_action' onClick={skiptoNext}/>  
      </div>
      <div className='song-info'>
      <div className='image' >
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/70x70` : ""} loading= "lazy" alt=""></img>
      </div>
      <div className="title">
        {currentSong.artists.length !== 0 ? currentSong.artists[0].name + " - " + currentSong.title :  currentSong.title}
      </div>
      {frequencyData ? 
        (
        <div className='analyzer'>
          { Array.from(frequencyData).map((elem)=>(
               <div className='analyzer-column' key={Math.random()+elem} style={{backgroundColor:`rgb(${elem},0,0,${elem/2})`,height:`${elem*0.9}px`,width:`15px`,rotate:`${elem*0.95}deg`}}></div>
          ))}
        </div>
        ):(<></>)}  
      </div>
      <div className="navigation">
      <div className={`navigation_wrapper ${isSongLoading ? "loading" : ""}`} onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div>
      <audio crossorigin="anonymous" src={currentSong.url} ref={audioElem} onLoadStart={()=>{console.log("Гружу");setIsSongLoading(true)}} onError={(e)=>{setIsSongLoading(false)}} onCanPlay={()=>{console.log("Могу ебашить");setIsSongLoading(false)}} onEnded={(e)=>{skiptoNext(e)}} onTimeUpdate={onPlaying} />
      <div className='playing-controls'>
        <BsRepeat1 className={`loop-track ${playerRepeat ? "active" : ""}`} onClick={()=>{setPlayerRepeat(!playerRepeat)}}/>
        <BsShuffle className={`play-random ${playerRandom ? "active" : ""}`} onClick={()=>{setPlayerRandom(!playerRandom)}}/>
        <button type="" onClick={(e)=>{e.preventDefault();setAnalyzer(AudioAnayzer(audioElem))}}>Поставить</button>
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