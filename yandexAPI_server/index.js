import { YMApi, WrappedYMApi } from "ym-api";
import express from 'express'
import cors from 'cors'
import {} from 'dotenv/config'
import { timeStamp } from "console";

const app = express()

app.use(cors())

const api = new YMApi();

const wrappedYMApi = new WrappedYMApi();

let getPlaylistTracks= async (kind,userId) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getPlaylist(kind,userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getFeed = async () => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getFeed();
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getPlaylists = async (id) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getUserPlaylists(id);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getLikedTracks = async (userId=process.env.USER_ID) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getLikedTracks(userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getTrackLink = async (id) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
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

let getTrackSupplement = async (id) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let lyrics = await api.getTrackSupplement(`${id}`);
    if (lyrics){
    return lyrics
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getSimilarTracks = async (id) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let lyrics = await api.getSimilarTracks(`${id}`);
    if (lyrics){
    return lyrics
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getChart = async (type) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let chart = await api.getChart(type);
    if (chart){
    return chart
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let likeTracks = async (userId,tracks) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let response = await api.likeTracks(userId,tracks);
    if (response){
    return response
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let dislikeTracks = async (userId,tracks) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let response = await api.dislikeTracks(userId,tracks);
    if (response){
    return response
    }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let searchTracks = async (query) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    const result = await api.search(query);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let searchArtist = async (artist) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    const result = await api.searchArtists(artist);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let getArtist = async (artist) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    const artist1 = await api.searchArtists(artist);
    const result = await api.getArtist(artist1.artists.results[0].id);
    return result
  } catch (e) {
    console.log(`api error ${e}`);  
  }
};


app.get('/ya/trackinfo/:id', async (req,res) =>{
  let id = req.params.id
  await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
  let track = await api.getTrack(id)
  res.json(track[0])
})

app.get('/ya/myTracks', async (req,res)=>{
  let tracks = await getPlaylistTracks(3)
  tracks.title = "Мне нравится"
  res.json(tracks)
})

app.get('/ya/likedTracks', async (req,res)=>{
  let tracks = await getLikedTracks()
  res.json(tracks)
})


app.get('/ya/playlist/tracks/:userId/:kind', async (req,res)=>{
  let userId = req.params.userId
  let kind = req.params.kind
  let tracks = await getPlaylistTracks(kind,userId)
  if (tracks){
  tracks = tracks.tracks.map((song)=>song.track)
  }
  res.json(tracks)
})

app.get('/ya/tracks/:id', async (req,res)=>{
  let id = req.params.id
  let track = await getTrackLink(id)
  res.json(track)
})

app.get('/ya/tracks/:id/similar', async (req,res)=>{
  let id = req.params.id
  let track = await getSimilarTracks(id)
  res.json(track)
})


app.get('/ya/tracks/:id/supplement', async (req,res)=>{
  let id = req.params.id
  let track = await getTrackSupplement(id)
  res.json(track)
})

app.get('/ya/playlists/', async (req,res)=>{
  let track = await getPlaylists(process.env.USER_ID)
  res.json(track)
})

app.get('/ya/feed/', async (req,res)=>{
  let feed = await getFeed()
  res.json(feed)
})

app.get('/ya/search/:query', async (req,res)=>{
  let query = req.params.query
  let result = await searchTracks(query)
  res.json(result)
})

app.get('/ya/search/artists/:query', async (req,res)=>{
  let query = req.params.query
  let result = await searchArtist(query)
  res.json(result)
})

app.get('/ya/artists/:artist', async (req,res)=>{
  let artist = req.params.artist
  let result = await getArtist(artist)
  res.json(result)
})

app.post('/ya/likeTracks/:userId/:track', async (req,res)=>{
  let tracks = req.params.track
  let userId = req.params.userId
  console.log(tracks,userId)
  let result = await likeTracks(userId,tracks)
  res.json(result)
})

app.post('/ya/dislikeTracks/:userId/:track', async (req,res)=>{
  let tracks = req.params.track
  let userId = req.params.userId
  console.log(tracks,userId)
  let result = await dislikeTracks(userId,tracks)
  res.json(result)
})

app.get('/ya/chart', async (req,res)=>{
  let result = await getChart("russia")
  res.json(result)
})





// 65758301

// const getMusicLinks = async ()=>{
//   let tracks = await getMyTracks()
//   let arr = []
//   tracks = tracks.map((element) => ({id:element.track.id,title:element.track.title}));
//   for (let i=0;i<tracks.length;i++){
//     let link = await getTrackLink(tracks[i].id)
//     if (link){
//     arr.push({title:tracks[i].title,url:link})
//     }
//   }
//   return arr
// }

// let links = await getMusicLinks()
// console.log("Links ready")

// app.get('/', async (req,res)=>{
//   res.json(links)
// })

app.listen(process.env.PORT, function() {
  console.log(`[NodeJS] Application Listening on Port ${process.env.PORT}`);
});
