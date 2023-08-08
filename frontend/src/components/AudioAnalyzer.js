import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AudioAnayzer = (audioElem) => {
    let audioCtx = new window.AudioContext();
    let source = audioCtx.createMediaElementSource(audioElem.current)
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
    return analyser
};

export default AudioAnayzer;