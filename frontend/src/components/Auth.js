import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {

    return (
        <div className='auth-wrap'>
        <div className='auth'>
            <h1>Login</h1>
            <div>Login</div>
            <input type="text"></input>
            <div>Password</div>
            <input type="text"></input>
            <button>Login</button>
        </div>
        </div>
    );

};

export default Auth;