import React, { useEffect, useRef, useState } from 'react';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill, BsRepeat1,BsShuffle} from 'react-icons/bs';
import AudioAnayzer from './AudioAnalyzer';
let volumeMultiplier = 0.5
const Player = ({isplaying, setisplaying, currentSongs, audioVolume, setAudioVolume, currentSong,isSongLoading, setIsSongLoading, audioElem, setCurrentSong,setPrevSong, setDominantColor, dominantColor})=> {
  const [playerRepeat,setPlayerRepeat] = useState(localStorage.getItem("playerRepeat") === "true" ? true : false)
  const [playerRandom,setPlayerRandom] = useState(localStorage.getItem("playerRandom") === "true" ? true : false)
  const [analyser,setAnalyzer] = useState()
  const [frequencyData,setfrequencyData] = useState()
  const [fftSize,setfftSize] = useState()

  const [visualizerSpeed,setVsualizerSpeed] = useState(1)
  const [visualizerOpacity,setVsualizerOpacity] = useState(1)

  const clickRef = useRef();
  const audioVisualizer = useRef()
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
    if (playerRepeat && audioElem.current.currentTime >= 3){ 
      audioElem.current.currentTime = 0
      audioElem.current.play()
    } else if (playerRandom) {
      audioElem.current.src = ""
      let randomSong = ()  => (Math.random() * (currentSongs.length - 0 + 1) ) << 0
     let songId = randomSong()
     if (currentSongs[songId].id === currentSong.id) {
       songId++
     } else {
     setCurrentSong(currentSongs[songId])
     }
    }else if (!isSongLoading){
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
    if (!isplaying) {
      setisplaying(true)
     }
  }


    const skiptoNext = ()=>
  {  
    if (playerRepeat && audioElem.current.currentTime === currentSong.length){ 
      audioElem.current.currentTime = 0
      audioElem.current.play()
    } else if (playerRandom) {
      audioElem.current.src = ""
      let randomSong = ()  => (Math.random() * (currentSongs.length - 0 + 1) ) << 0
     let songId = randomSong()
     if (currentSongs[songId].id === currentSong.id) {
       songId++
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
   if (!isplaying) {
    setisplaying(true)
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
    if (e.key === " " && e.srcElement.tagName !== "INPUT"){
      e.preventDefault()
      !isplaying ? audioElem.current.play() : audioElem.current.pause()
      }
  }

  const drawColumns = (x,width,height,color) =>{
    if(frequencyData){
    const ctx = audioVisualizer.current.getContext('2d')
      ctx.fillStyle=color
      ctx.fillRect(x,audioVisualizer.current.height-height/2,width,height)
    }
  }

  const renderVisualizer = () => {
    if (frequencyData) {
    const ctx = audioVisualizer.current.getContext('2d')
    let data = Array.from(frequencyData)
    ctx.clearRect(0,0,audioVisualizer.current.width,audioVisualizer.current.height)
    const columnWidth = ((audioVisualizer.current.width/data.length)+3)
    const heightScale = audioVisualizer.current.height/110
    let xPos = 0
    for (let i = 0;i<data.length;i++) {
      let columnHeight = data[i] * heightScale
      let color = `rgb(${data[i]+40},0,0)`
      // let color = dominantColor
      drawColumns(xPos,columnWidth,columnHeight,color)
      
      xPos += columnWidth -1
    }
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
    if (!currentSong.available){
      skiptoNext()
    } else {
      audioElem.current.play()
      .catch(e=>console.warn(e))
    }
  }, [currentSong.url,currentSong.title])


  useEffect(() => {
    setPrevSong(currentSong)
    localStorage.setItem("lastPlayedTrack",JSON.stringify(currentSong))
  }, [currentSong])


  useEffect(() => {
    localStorage.setItem("playerRandom",playerRandom)
  }, [playerRandom])

  useEffect(() => {
    localStorage.setItem("playerRepeat",playerRepeat)
  }, [playerRepeat])



  useEffect(()=>{
    let a = setTimeout(()=>{
      setfrequencyData(getAnalyzerInfo())
      renderVisualizer()
    },10)
    return ()=>clearTimeout(a)
  })



  useEffect(()=>{
    audioVisualizer.current.width = window.innerWidth
    audioVisualizer.current.height = window.innerHeight
},[window.innerWidth, window.innerHeight])




  // useEffect(() => {
  //   if (isplaying) {
  //     audioElem.current.play();
  //     if (currentSong.progress){ 
  //       audioElem.current.currentTime = currentSong.progress/100 * currentSong.length
  //     }
  //   }
  //   else {
  //     audioElem.current.pause();
  //   }

  // }, [isplaying])

  return (
    <div className={`player ${isplaying ? "active" : ""}`}>
      <div className='player-image-section' onClick={()=>{!isplaying ? audioElem.current.play() : audioElem.current.pause()}}>
      <div className='image'>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/300x300` : ""} loading= "lazy" alt=""></img>
      </div>
      <div className='second-image'>
      <img src={currentSong.ogImage ? `http://${currentSong.ogImage.substring(0, currentSong.ogImage.lastIndexOf('/'))}/400x400` : ""} loading= "lazy" alt=""></img>
      </div>
      </div>
      <div className='player-controls-section'>
      <div className="controls">
        <BsFillSkipStartCircleFill style = {{display:`${currentSongs ? "flex" : "none"}`}} className='btn_action' onClick={skipBack}/>
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={()=>{audioElem.current.pause()}}/> : <BsFillPlayCircleFill className='btn_action pp' onClick={()=>{audioElem.current.play()}}/>}
        <BsFillSkipEndCircleFill style = {{display:`${currentSongs  ? "flex" : "none"}`}} className='btn_action' onClick={skiptoNext}/>  
      </div>
      <div className="title">
        {currentSong.artists.length !== 0 ? currentSong.artists[0].name + " - " + currentSong.title :  currentSong.title}
      </div>
      <div className={`navigation_wrapper ${isSongLoading ? "loading" : ""}`} onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      <audio crossOrigin="anonymous" src={currentSong.url} ref={audioElem} onLoadStart={()=>{currentSong.url !== "" ?setIsSongLoading(true) : console.log("Error")}}  onError={(e)=>{currentSong.url !== "" ?setIsSongLoading(true) : console.log("Error")}} onCanPlay={()=>{setIsSongLoading(false)}} onPlay={() =>{setisplaying(true)}} onPause={()=>{setisplaying(false)}} onEnded={(e)=>{skiptoNext(e)}} onTimeUpdate={onPlaying} />
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
            {/* <div className='analyzer-settings'>
            <button type="" onClick={(e)=>{e.preventDefault();setAnalyzer(AudioAnayzer(audioElem))}}>AudioCTX</button>
                <select value={fftSize? fftSize : localStorage.getItem("analyzer_fftSize")} onChange={(e)=>{localStorage.setItem("analyzer_fftSize",e.target.value);setfftSize(e.target.value)}}>
                  <option value="64">64</option>
                  <option value="128">128</option>
                  <option value="256">256</option>
                  <option value="512">512</option>
                  <option value="1024">1024</option>
                  <option value="2048">2048</option>
                  <option value="4096">4096</option>
                </select>
            </div> */}
            <div className='analyzer-wrapper'>
      <canvas  className='analyzer' ref={audioVisualizer}></canvas> 
      </div>
              
      </div>
        </div>
  // style={{filter:`blur(200px)`,opacity:"0.8"}}
  )
}

export default Player