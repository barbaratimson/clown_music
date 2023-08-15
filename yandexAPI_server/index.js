import { YMApi } from "ym-api";
import express from 'express'
import cors from 'cors'
import {} from 'dotenv/config'

const app = express()

app.use(cors())

const api = new YMApi();

let getPlaylistTracks= async (kind,userId) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getPlaylist(kind,userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getFeed= async () => {
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


let getTrackLink = async (id) => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    const info = await api.getTrackDownloadInfo(`${id}`);
    const link = await api.getTrackDirectLink(info[1].downloadInfoUrl);
    if (link){
    return link
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
    console.log(`api error ${e.message}`);
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
  tracks.title = "Мои треки"
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
