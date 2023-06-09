const APP_ID = '9f615713eb6c46cda980bf8e84ae8cf7'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')

let UID = Number(sessionStorage.get('UID'));

let NAME = sessionStorage.getItem('name')

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})


let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async() =>{
    document.getElementById('room-name').innerText() = CHANNEL
    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    try{
      await client.join(APP_ID,CHANNEL,TOKEN,UID)
    }catch(error){
      console.log(error)
      window.open('/','_self')
    }
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                  <div class="video-player" id="user-${UID}"></div> 
                  <div class="username-wrapper"><span class="user-name">Tommy</span></div>
                </div>`
    document.getElementById("video-streams").insertAdjacentHTML("beforeend",player)
    localTracks[1].play('user-${UID}')
    await client.publish([localTracks[0],localTracks[1]])
}

let handleUserJoined = async(user,mediaType) =>{
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)
    if(mediaType === 'video'){
      let player = document.getElementById('user-container-${user.uid}')
      if(player != null){
        player.remove()
      }
      player = `<div class="video-container" id="user-container-${user.UID}">
                <div class="video-player" id="user-${user.UID}"></div> 
                <div class="username-wrapper"><span class="user-name">Tommy</span></div>
                </div>`
      document.getElementById("video-streams").insertAdjacentHTML("beforeend",player)
      user.videoTrack.play('user-${user.uid}')     
    }
    if(mediaType === 'auto'){
      user.videoTrack.play()
    }
}

let handleUserLeft = async(user) =>{
  delete remoteUsers[user.uid]
  document.getElementById('user-container-${user.uid}').remove()
}


let leaveAndRemoveLocalStream = async() =>{
  for(let i = 0;i < localTracks.length;i++){
    localTracks[i].stop()
    localTracks[i].close()
  }
  await client.leave()
  windows.open('/','_self')
}

let toggleCamera = async(e) =>{
  if(localTracks[1].muted){
    await localTracks[1].setMuted(false)
    e.target.style.backgroundColor = '#fff'
  }else{
    await localTracks[1].setMuted(true)
    e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'    
  }
}

let toggleMic = async(e) =>{
  if(localTracks[0].muted){
    await localTracks[0].setMuted(false)
    e.target.style.backgroundColor = '#fff'
  }else{
    await localTracks[0].setMuted(true)
    e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'    
  }
}

joinAndDisplayLocalStream()


document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)

document.getElementById('camera-btn').addEventListener('click',toggleCamera)

document.getElementById('mic-btn').addEventListener('click',toggleMic)