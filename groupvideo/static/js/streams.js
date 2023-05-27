const APP_ID = '9f615713eb6c46cda980bf8e84ae8cf7'
const CHANNEL = 'main'
const TOKEN = '007eJxTYDCfn7smUcBk/41TZTo5BWl3MiO4Jr3qVnst8SFdVERt6TUFBss0M0NTc0Pj1CSzZBOz5JRESwuDpDSLVAuTxFSL5DTzzY1FKQ2BjAysLHKsjAwQCOKzMOQmZuYxMAAA/zEd0Q=='

let UID;

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})


let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async() =>{
    UID = await client.join(APP_ID,CHANNEL,TOKEN,null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                  <div class="video-player" id="user-${UID}"></div> 
                  <div class="username-wrapper"><span class="user-name">Tommy</span></div>
                </div>`
    document.getElementById("video-streams").insertAdjacentHTML("beforeend",player)
    localTracks[1].play('user-${UID}')
    await client.publish([localTracks[0],localTracks[1]])
}

joinAndDisplayLocalStream()
