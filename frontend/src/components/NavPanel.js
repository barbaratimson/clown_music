import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsFillPauseFill, BsMusicNote, BsPlayFill } from 'react-icons/bs';

const NavPanel = () => {

    return (
        <div className="navigation-panel">
            <div className='navigation-panel-buttons'>
                <div className='navigation-panel-button'>
                    <div className='navigation-panel-button-playlists'>
                        PL
                    </div>
                </div>
                <div className='navigation-panel-button'>
                    
                    </div>
                    <div className='navigation-panel-button'>
                    
                    </div>
                    <div className='navigation-panel-button'>
                    
                    </div>
                    <div className='navigation-panel-button'>
                    
                    </div>
            </div>

    </div>
        
    );

};

export default NavPanel;


