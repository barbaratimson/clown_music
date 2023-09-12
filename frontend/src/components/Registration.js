import React, { useEffect,useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration = () => {



    return (
        <div className='auth-wrap'>
        <div className='auth'>
            <h1>Registration</h1>
            <div>Login</div>
            <input type="text"></input>
            <div>Password</div>
            <input type="text"></input>
            <input type="text"></input>
            <button>Register</button>
        </div>
        </div>
    );

};

export default Registration;