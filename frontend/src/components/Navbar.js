import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [search,setSearch] = useState('')
    
  
    const handleSearch = async () => {
        if (search){
          try {
            const response = await axios.get(
              `http://localhost:5051/ya/search/${search}`,);
              console.log(response)
          } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
          }
        }
      };

    useEffect(() => {
        let Debounce = setTimeout(()=>{
            handleSearch()
        },350)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);
    
    return (
        <div className="nav">
                <div className="nav-wrapper">
                    <div className="logo">
        <div className="logo-pic">🤡</div>
        <div className="logo-text">YaClown Music</div>
        </div>
    <div className="nav-buttons">
    <button className="nav-button">Home</button>
    <button className="nav-button">About</button>
    </div>
    <div className="nav-search-wrapper">
    <div className="nav-searchbar">
    <input className='nav-search' type='text' defaultValue={"Поиск"} onChange={(e) => {setSearch(`${e.target.value}`)}}/>
        <div className="nav-search-start">Search</div>
    </div>
    </div>
    <button onClick={()=>{localStorage.clear()}}>LS CLEAR</button>
    <div className="nav-user">
        <div className ="user-username">Barbaratimson</div>
        <div className="user-avatar">
            <img src="https://sun9-36.userapi.com/impg/KBThyRabdLXw6Km0CnJ4gQJKcR7iw5Uu8T6wpg/D0Bh4x-veqY.jpg?size=822x1024&quality=95&sign=8f9825c03df99a8adaa7b94c9d0639d5&type=album" alt=""></img>
        </div>
    </div>
    <div className="user-menu hidden"></div>
</div>

    </div>
        
    );

};

export default Navbar;


