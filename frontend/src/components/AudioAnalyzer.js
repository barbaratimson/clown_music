import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AudioAnayzer = (audioElem) => {
  let audioCtx = new window.AudioContext();
  let fftSize = localStorage.getItem("analyzer_fftSize")
    let source = audioCtx.createMediaElementSource(audioElem.current)
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = fftSize && fftSize > 128 ? fftSize : 1024;
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
    return analyser
};


export default AudioAnayzer;