import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BsFillPauseFill, BsMusicNote, BsPlayFill} from 'react-icons/bs';
import {HiSearch} from "react-icons/hi";
import {
    RiCloseFill,
    RiPauseFill,
    RiPauseMiniFill,
    RiPlayFill,
    RiPlayMiniFill,
    RiSearch2Line,
    RiSearchLine
} from 'react-icons/ri';
import Track from './Track';
import {useDispatch, useSelector} from 'react-redux';
import {changeCurrentPage} from '../store/currentPageSlice';
import {changeModalState} from '../store/modalSlice';
import Loader from './Loader';
import {IoIosWarning} from "react-icons/io";
import {FaUser} from "react-icons/fa";
import {FaKey} from "react-icons/fa6";
import {LuEye, LuEyeOff} from "react-icons/lu";
import {changePlayerFolded} from "../store/playerFolded";
import {changeArtist} from "../store/artistSlice";

const link = process.env.REACT_APP_YMAPI_LINK

const header = localStorage.getItem("Authorization")

const [localUserId, localAccessToken] = header ? header.split(":") : []

const Navbar = ({setViewedPlaylist, audioElem, setPrevSong}) => {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [searchFolded, setSearchFolded] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [accessToken, setAccessToken] = useState(localAccessToken ?? "")
    const [userId, setUserId] = useState(localUserId ?? "")
    const [showToken, setShowToken] = useState(false)
    const [userData, setUserData] = useState({})
    const [userAgreed, setUserAgreed] = useState(false)
    const active = useSelector(state => state.modalActive.modalActive)
    const dispatch = useDispatch();
    const currentPage = useSelector(state => state.currentPage.currentPage)
    const [userDataLoading, setUserDataLoading] = useState(false)

    const setPlayerFolded = (state) => dispatch(changePlayerFolded(state))

    const setCurrentPage = (playlist) => dispatch(changeCurrentPage(playlist))
    const setActive = (state) => dispatch(changeModalState(state))

    const setArtist = (state) => dispatch(changeArtist(state))
    const artist = useSelector(state => state.artist.artist)
    const isplaying = useSelector(state => state.isplaying.isplaying)

    const input = useRef(null)
    const searchRef = useRef(null)
    const userMenuRef = useRef(null)
    const userMenuButton = useRef(null)
    const handleSearch = async () => {
        setIsLoading(true)
        if (search) {
            try {
                const response = await axios.get(
                    `${link}/ya/search/${search}`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
                setSearchResults(response.data)
                console.log(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Ошибка при получении списка треков:', err);
                console.log(err)
            }
        }
    };

    const fetchUser = async () => {
        try {
            setUserDataLoading(true)
            const response = await axios.get(
                `${link}/ya/user`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
            console.log(response.data)
            setUserData(response.data)
            setUserDataLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };


    useEffect(() => {
        if (search === "") {
            setSearchResults(null)
        }
        let Debounce = setTimeout(() => {
            handleSearch()
        }, 350)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target) && !active) {
                setSearchFolded(true)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef, active]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target) && !userMenuButton.current.contains(event.target)) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef]);

    const closeArtistTab = (e) => {
        e.stopPropagation();
        if (currentPage === "artists") {
            setCurrentPage("currentPlaylist");
            setPlayerFolded(false)
        }
        setArtist(null);
    }

    useEffect(() => {
        localStorage.setItem("Authorization", userId + ":" + accessToken)
        fetchUser()
    }, [userId, accessToken])

    useEffect(() => {
        if (!searchFolded) {
            input.current.focus()
        }
    }, [searchFolded])
    return (
        <div className="nav">
            <div className="nav-wrapper">
                <div className='nav-selection'>
                    <div className={`nav-selection-button nav-logo ${currentPage === "mainPage" ? "active" : ""}`}
                         onClick={() => {
                             setCurrentPage("mainPage");
                             setPlayerFolded(true)
                         }}>
                        <div className="logo">
                            <div className="logo-pic">🤡</div>
                            {/* <div className="logo-text">YaClown Music</div> */}</div>
                    </div>
                    <div
                        className={`nav-selection-button nav-player ${currentPage === "currentPlaylist" ? "active" : ""}`}
                        onClick={() => {
                            setCurrentPage("currentPlaylist");
                            setPlayerFolded(false)
                        }}>{isplaying ? <RiPlayFill/> : <RiPauseFill/>}</div>
                    <div className={`nav-selection-button ${currentPage === "userPlaylists" ? "active" : ""}`}
                         onClick={() => {
                             setCurrentPage("userPlaylists");
                             setPlayerFolded(true)
                         }}>PLAYLISTS
                    </div>
                    <div className={`nav-selection-button ${currentPage === "myTracks" ? "active" : ""}`}
                         onClick={() => {
                             setCurrentPage("myTracks");
                             setPlayerFolded(true)
                         }}>MY TRACKS
                    </div>
                    <div className={`nav-selection-button ${currentPage === "chart" ? "active" : ""}`} onClick={() => {
                        setCurrentPage("chart");
                        setPlayerFolded(true)
                    }}>CHART
                    </div>
                    {artist ? (
                        <div className={`nav-selection-button artist ${currentPage === "artists" ? "active" : ""}`}
                             onClick={() => {
                                 setCurrentPage("artists");
                                 setPlayerFolded(true)
                             }}>
                            <div className="nav-selection-button-close" onClick={(e) => {
                                closeArtistTab(e)
                            }}><RiCloseFill/></div>
                            <span>ARTIST</span>
                            <div className="nav-selection-button-artist">{artist}</div>
                        </div>) : null}
                </div>
                <div ref={searchRef} className="nav-search-wrapper">
                    <div className="nav-searchbar">
                        <input ref={input} value={search} className={`nav-search ${searchFolded ? "folded" : ""}`}
                               type='text' onChange={(e) => {
                            setSearch(`${e.target.value}`)
                        }}/>
                        <div className="nav-search-start" style={{fontSize: `${searchFolded ? "30px" : "25px"}`}}
                             onClick={() => {
                                 setSearchFolded(!searchFolded);
                                 setSearch("")
                             }}><HiSearch/></div>
                    </div>
                    <div className={`nav-search-results ${!search || searchFolded ? "hidden" : ""}`}>
                        {!isLoading ? (
                            <>
                                <div className="nav-search-line">Artists</div>
                                {searchResults && searchResults.artists?.results ? (searchResults?.artists.results.map(artist => (
                                    <div className="playlist-song" key={artist.id} onClick={() => {
                                        setArtist(artist.name);
                                        setCurrentPage("artists");
                                        setPlayerFolded(true)
                                    }}>
                                        <div className='playlist-song-image'>
                                            <img
                                                src={artist.ogImage ? `http://${artist.ogImage.substring(0, artist.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"}
                                                loading="lazy" alt=""></img>
                                        </div>
                                        <div className='playlist-song-title'>
                                            {artist.name}
                                        </div>

                                    </div>
                                ))) : null}

                                <div className="nav-search-line">Tracks</div>

                                {searchResults && searchResults.tracks ? (searchResults.tracks.results.map(song => (
                                    <Track key={song.id} setPrevSong={setPrevSong} audioElem={audioElem}
                                           song={song}></Track>
                                ))) : null}

                                <div className="nav-search-line">Albums</div>

                                {searchResults && searchResults.playlists ? (searchResults.playlists.results.map(playlist => (
                                    <div className="playlist-song" key={playlist.playlistUuid} onClick={() => {
                                        setViewedPlaylist(playlist);
                                        setActive(true)
                                    }}>
                                        <div className='playlist-song-image'>
                                            <img
                                                src={playlist.ogImage ? `http://${playlist.ogImage.substring(0, playlist.ogImage.lastIndexOf('/'))}/50x50` : "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_like.png"}
                                                loading="lazy" alt=""></img>
                                        </div>
                                        <div className='playlist-song-title'>
                                            {playlist.title}
                                        </div>

                                    </div>
                                ))) : null}
                            </>
                        ) : (<Loader></Loader>)}


                    </div>
                </div>
                <div ref={userMenuButton} className="nav-user" onClick={() => {
                    setShowUserMenu(!showUserMenu)
                }}>
                    <div className="user-avatar">
                        <img
                            src="https://sun9-36.userapi.com/impg/KBThyRabdLXw6Km0CnJ4gQJKcR7iw5Uu8T6wpg/D0Bh4x-veqY.jpg?size=822x1024&quality=95&sign=8f9825c03df99a8adaa7b94c9d0639d5&type=album"
                            alt=""></img>
                    </div>
                </div>
                <div ref={userMenuRef} className={`user-menu ${!showUserMenu ? "hidden" : ""}`}>
                    {userAgreed ? (
                        <div className={"user-menu-wrapper"}>
                            {!userDataLoading ? (
                                <div className="user-username">{userData.account?.displayName}</div>
                            ) : (<div>Loading</div>)}
                            <div className="user-menu-input-wrapper">
                                <div className="user-menu-input-icon" title="Yandex user ID"><FaUser/></div>
                                <input type={"text"} className="user-menu-input" placeholder='Yandex user ID'
                                       onChange={(e) => {
                                           setUserId(e.target.value)
                                       }} value={userId}></input>
                            </div>
                            <div className="user-menu-input-wrapper">
                                <div className="user-menu-input-icon" title="Yandex Access token"><FaKey/></div>
                                <input className="user-menu-input" type={!showToken ? "password" : "text"}
                                       placeholder='Yandex Access token' onChange={(e) => {
                                    setAccessToken(e.target.value)
                                }} value={accessToken}></input>
                                <div className="user-menu-show-button" onClick={(() => {
                                    setShowToken(!showToken)
                                })}>{showToken ? <LuEye/> : <LuEyeOff/>}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="user-menu-warning">
                            <div className="warning-image"><IoIosWarning/></div>
                            <div className="warning-top">Warning</div>
                            <div className="warning-message">Information you entered here should not be shared or shown
                                to anyone else!
                            </div>
                            <div className="warning-button" onClick={() => {
                                setUserAgreed(true)
                            }}>OK
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>

    );

};

export default Navbar;


