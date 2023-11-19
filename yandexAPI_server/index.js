import { YMApi, WrappedYMApi } from "ym-api";
import express from 'express'
import cors from 'cors'
import {} from 'dotenv/config'

const app = express()

app.use(cors())

const api = new YMApi();

const checkToken = (req,res,next) => {
    const authHeader = req.header('Authorization')
    if (authHeader) {
      const [userId, accessToken] = authHeader.split(":")
      req.userId = userId
      req.accessToken = accessToken
    } else {
      res.status(400).json("Authorization header empty or invalid")
      return
    }
    next()
}

let getPlaylistTracks = async (kind,userId,userId2,accessToken) => {
  try {
    await api.init({ uid:userId2,access_token:accessToken});
    return await api.getPlaylist(kind,userId);
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getUser = async (userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    console.log(await api.getAccountStatus())
    // return await api.getAccountStatus();
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getFeed = async (userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let result = await api.getFeed();
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getPlaylists = async (id,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let result = await api.getUserPlaylists(id);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getLikedTracks = async (userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let result = await api.getLikedTracks(userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getTrackLink = async (id,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let info = await api.getTrackDownloadInfo(`${id}`);
    info = info.find(elem => elem.codec === 'aac' && elem.bitrateInKbps === 128)
    const link = await api.getTrackDirectLink(info.downloadInfoUrl);
    if (link){
    return link
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getTrackSupplement = async (id,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let lyrics = await api.getTrackSupplement(`${id}`);
    if (lyrics){
    return lyrics
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getSimilarTracks = async (id,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let lyrics = await api.getSimilarTracks(`${id}`);
    if (lyrics){
    return lyrics
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getChart = async (type,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let chart = await api.getChart(type);
    if (chart){
    return chart
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let likeTracks = async (tracks,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let response = await api.likeTracks(userId,tracks);
    if (response){
    return response
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let dislikeTracks = async (tracks,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    let response = await api.dislikeTracks(userId,tracks);
    if (response){
    return response
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let searchTracks = async (query,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    const result = await api.search(query);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let searchArtist = async (artist,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    const result = await api.searchArtists(artist);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let getArtist = async (artist,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken});
    const artist1 = await api.searchArtists(artist);
    const result = await api.getArtist(artist1.artists.results[0].id);
    return result
  } catch (e) {
    console.log(`api error ${e}`);  
  }
};

let getAlbumTracks = async (album,userId,accessToken) => {
  try {
    await api.init({ uid:userId,access_token:accessToken });
    const album1 = await api.getAlbumWithTracks(album);
    console.log(album1)
    return album1
  } catch (e) {
    console.log(`api error ${e}`);  
  }
};

app.get('/ya/user', checkToken ,async (req,res) =>{
  await api.init({ uid:req.userId,access_token:req.accessToken });
  let track = await api.getAccountStatus()
  res.json(track)
})
app.get('/ya/trackinfo/:id', checkToken, async (req,res) =>{
  let id = req.params.id
  await api.init({ uid:req.userId,access_token:req.accessToken });
  let track = await api.getTrack(id)
  if (track) {
    res.json(track[0])
  }
})

app.get('/ya/myTracks',  checkToken, async (req,res)=>{
  let tracks = await getPlaylistTracks(3,req.userId,req.accessToken)
  if (tracks) {
    tracks.title = "Мне нравится"
  }
  res.json(tracks)
})

app.get('/ya/likedTracks', checkToken, async (req,res)=>{
  let tracks = await getLikedTracks(req.userId,req.accessToken)
  res.json(tracks)
})


app.get('/ya/playlist/tracks/:kind/:userId', checkToken , async (req,res)=>{
  let userId = req.params.userId
  let kind = req.params.kind
  let tracks = await getPlaylistTracks(kind,userId,req.userId,req.accessToken)
  if (tracks){
  tracks = tracks.tracks.map((song)=>song.track)
  }
  res.json(tracks)
})

app.get('/ya/tracks/:id', checkToken , async (req,res)=>{
  let id = req.params.id
  let track = await getTrackLink(id,req.userId,req.accessToken)
  res.json(track)
})

app.get('/ya/tracks/:id/similar', checkToken , async (req,res)=>{
  let id = req.params.id
  let track = await getSimilarTracks(id,req.userId,req.accessToken)
  res.json(track)
})


app.get('/ya/tracks/:id/supplement', checkToken , async (req,res)=>{
  let id = req.params.id
  let track = await getTrackSupplement(id,req.userId,req.accessToken)
  res.json(track)
})

app.get('/ya/playlists/', checkToken , async (req,res)=>{
  let track = await getPlaylists(req.userId,req.accessToken)
  res.json(track)
})

app.get('/ya/feed/', checkToken , async (req,res)=>{
  let feed = await getFeed(req.userId,req.accessToken)
  res.json(feed)
})

app.get('/ya/search/:query', checkToken , async (req,res)=>{
  let query = req.params.query
  let result = await searchTracks(query,req.userId,req.accessToken)
  res.json(result)
})

app.get('/ya/search/artists/:query', checkToken , async (req,res)=>{
  let query = req.params.query
  let result = await searchArtist(query,req.userId,req.accessToken)
  res.json(result)
})

app.get('/ya/artists/:artist', checkToken , async (req,res)=>{
  let artist = req.params.artist
  let result = await getArtist(artist,req.userId,req.accessToken)
  res.json(result)
})

app.get('/ya/album/:albumId', checkToken , async (req,res)=>{
  let album = req.params.albumId
  let result = await getAlbumTracks(album,req.userId,req.accessToken)
  res.json(result)
})


app.post('/ya/likeTracks/:track', checkToken , async (req,res)=>{
  let tracks = req.params.track
  let result = await likeTracks(tracks,req.userId,req.accessToken)
  res.json(result)
})

app.post('/ya/dislikeTracks/:track', checkToken , async (req,res)=>{
  let tracks = req.params.track
  let result = await dislikeTracks(tracks,req.userId,req.accessToken)
  res.json(result)
})

app.get('/ya/chart', async (req,res)=>{
  let result = await getChart("russia")
  res.json(result)
})

app.listen(process.env.PORT, function() {
  console.log(`[NodeJS] Application Listening on Port ${process.env.PORT}`);
});
