import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {AiOutlineLoading} from 'react-icons/ai'
import axios from 'axios';

const Loader = () => {

    return (
        <div className='loader'>
            <AiOutlineLoading className='spinner'/>
        </div>
    );

};

export default Loader;