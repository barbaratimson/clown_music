const {YMApi} = require("ym-api");
const express = require('express')
const cors = require('cors')
const {} = require('dotenv/config')

const app = express()

app.use(cors())

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
    const api = new YMApi();
    await api.init({ uid:userId2,access_token:accessToken});
    return await api.getPlaylist(kind,userId);
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getFeed = async (userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    let result = await api.getFeed();
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getPlaylists = async (userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId, access_token:accessToken});
    let result = await api.getUserPlaylists(userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getLikedTracks = async (userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    let result = await api.getLikedTracks(userId);
    return result
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};


let getTrackLink = async (id,userId,accessToken) => {
  try {
    let link = ""
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    let info = await api.getTrackDownloadInfo(`${id}`);
    console.log(info)
    const infoBest = info.find(elem => elem.codec === 'aac' && elem.bitrateInKbps === 192 || elem.codec === 'mp3' && elem.bitrateInKbps === 192 )
    if (infoBest) {
      link = await api.getTrackDirectLink(infoBest.downloadInfoUrl);
        console.log("Chosen quality: " + infoBest.codec + " " + infoBest.bitrateInKbps)
    } else {
      const infoSecond = info.find(elem => elem.codec === 'aac' && elem.bitrateInKbps === 128 || elem.codec === "mp3" && elem.bitrateInKbps === 128)
      if (infoSecond) {
          console.log("Chosen quality: " + infoSecond.codec + " " + infoSecond.bitrateInKbps)
          link = await api.getTrackDirectLink(infoSecond.downloadInfoUrl);
      } else {
          const infoThird = info.find(elem => elem.codec === 'aac' && elem.bitrateInKbps === 64 || elem.codec === "mp3" && elem.bitrateInKbps === 64)
          link = await api.getTrackDirectLink(infoSecond.downloadInfoUrl);
          console.log("Chosen quality: " + infoThird.codec + " " + infoThird.bitrateInKbps)
      }
    }
      if (link){
        return link
      }
  } catch (e) {
    console.log(`api error ${e.message}`);
  }
};

let getTrackSupplement = async (id,userId,accessToken) => {
  try {
    const api = new YMApi();
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
    const api = new YMApi();
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
    const api = new YMApi();
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
    const api = new YMApi();
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
    const api = new YMApi();
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
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    const result = await api.search(query);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let searchArtist = async (artist,userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    const result = await api.searchArtists(artist);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let getArtist = async (artist,userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    const artist1 = await api.searchArtists(artist);
    const result = await api.getArtist(artist1.artists.results[0].id);
    return result
  } catch (e) {
    console.log(`api error ${e}`);  
  }
};

let getArtistById = async (artistId,userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken});
    console.log(artistId)
    const result = await api.getArtist(artistId);
    return result
  } catch (e) {
    console.log(`api error ${e}`);
  }
};

let getAlbumTracks = async (album,userId,accessToken) => {
  try {
    const api = new YMApi();
    await api.init({ uid:userId,access_token:accessToken });
    const album1 = await api.getAlbumWithTracks(album);
    console.log(album1)
    return album1
  } catch (e) {
    console.log(`api error ${e}`);  
  }
};

const createPlaylist = async (userId,accessToken,name, visibility) => {
  const api = new YMApi();
  await api.init({ uid:userId,access_token:accessToken });
  return api.createPlaylist(name, {visibility:visibility})
}

const deletePlaylist = async (userId,accessToken,playlistId) => {
  const api = new YMApi();
  await api.init({ uid:userId,access_token:accessToken });
  return api.removePlaylist(playlistId)
}

const addTrackToPlaylist = async (userId,accessToken,playlistId,tracks,revision) => {
  const api = new YMApi();
  await api.init({ uid:userId,access_token:accessToken });
  return api.addTracksToPlaylist(playlistId,tracks,revision)
}






// -------------------- ROUTES --------------------

app.get('/ya/user', async (req,res) =>{
  const accessHeader = req.header('Authorization').split(":")[1]
  if (!accessHeader) res.json({message:"No Auth header provided"})
  const api = new YMApi();
  await api.init({ uid:"xui", access_token:accessHeader });
  let track = await api.getAccountStatus()
  res.json(track)
})
app.get('/ya/trackinfo/:id', checkToken, async (req,res) =>{
  const api = new YMApi();
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

app.get('/ya/artist/:artist', checkToken , async (req,res)=>{
  let artist = req.params.artist
  console.log(artist)
  let result = await getArtistById(artist,req.userId,req.accessToken)
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

app.get('/ya/chart', checkToken, async (req,res)=>{
  let result = await getChart("russia")
  res.json(result)
})

app.get('/ya/playlist/create', checkToken , async (req,res)=>{
  let name = req.query.name
  let visibility = req.query.visibility
  console.log(visibility)
  let result = await createPlaylist(req.userId,req.accessToken, name, visibility)
  res.json(result)
})

app.get('/ya/playlist/:playlistId/remove', checkToken , async (req,res)=>{
  const id = req.params.playlistId
  let result = await deletePlaylist(req.userId,req.accessToken, id)
  res.json(result)
})

app.get('/ya/playlist/:playlistId/add', checkToken , async (req,res)=>{
  let id = req.params.playlistId
  let tracks = req.query.tracks
  let revision = req.query.revision
  let result = await addTrackToPlaylist(req.userId,req.accessToken, id, tracks, revision)
  res.json(result)
})

app.listen(process.env.PORT, function() {
  console.log(`[NodeJS] Application Listening on Port ${process.env.PORT}`);
});
