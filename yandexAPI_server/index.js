import { YMApi } from "ym-api";
import express from 'express'
import cors from 'cors'
import {} from 'dotenv/config'

const app = express()

app.use(cors())

const api = new YMApi();

let getMyTracks = async () => {
  try {
    await api.init({ uid:process.env.USER_ID,access_token:process.env.ACCSESS_TOKEN });
    let result = await api.getPlaylist("3");
    result = result.tracks.map((song)=>song.track)
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
    return link
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


app.get('/ya/myTracks', async (req,res)=>{
  let tracks = await getMyTracks()
  res.json(tracks)
})

app.get('/ya/tracks/:id', async (req,res)=>{
  let id = req.params.id
  let track = await getTrackLink(id)
  res.json(track)
})



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
