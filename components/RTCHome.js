import React, { useEffect, useState } from "react"

import { socket } from "../services/websocketservice"

let peerConnection = null
let RTCPeerConnection = null
let RTCSessionDescription = null
let receiveBuffer = [];
let receivedSize = 0;

let bytesPrev = 0;
let timestampPrev = 0;
let timestampStart;
let statsInterval = null;
let bitrateMax = 0;
let sentFileName = "";
let sentFileSize = 0;

let receiveChannel;

let downloadAnchor = {};

const setUpSocketEvents = (setPeers) => {
    socket.on("connect", () => {
        console.log("connected socket id : ", socket.id)
    });
    
    socket.on("disconnect", () => {
        console.log("disconnected socket id : ", socket.id)
    });
    
    socket.on("hello", (msg) => {
        console.log("Hello : ", msg)
    })
    
    socket.on("users", (users) => {
        console.log("users : ", users)
        const peers = []
        Object.keys(users).map(key => {
            peers.push({
                id: key,
                name: users[key]
            })
        })
        setPeers(peers)
    })

    socket.on("rtc-vchat-offer", async (senderId, offer) => {
        console.log("rtc-vchat-offer : ", senderId, offer)
        let ve1 = document.querySelector(".video-chat-container")
        if(ve1 && ve1.style) {
            if(ve1.style.visibility !== "visible") {
                peerConnection.addEventListener('datachannel', receiveChannelCallback)
                // downloadAnchor = document.querySelector('a#download');
            }
            ve1.style.visibility = "visible"
        }
        sessionStorage.setItem("video-receiver", true)
        sessionStorage.setItem("peerId", senderId)
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        )
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
        socket.emit("rtc-vchat-conn-answer", socket.id, senderId, answer )
    })
    socket.on("rtc-vchat-answer", async (receiverId, answer) => {
        console.log("rtc-vchat-answer : ", receiverId, answer)
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
        )
        if (!window.isAlreadyCalling) {
            callUser(receiverId);
            window.isAlreadyCalling = true;
        }
    })
    socket.on("rtc-ice-candidate", (candidate) => {
        console.log("rtc-ice-candidate : ", candidate)
        peerConnection.addIceCandidate(candidate)
            .then(res => {
            console.log("initiator add icecandidate success: ", res)
            })
            .catch(err => {
            console.log("initiator add icecandidate error : ", err)
            })
    })
    socket.on("rtc-sending-file", (fileSize, fileName) => {
        sentFileSize = fileSize
        sentFileName = fileName
        console.log("sentFileSize : ", sentFileSize)
        console.log("sentFileName : ", sentFileName)
    })
}

const sendMsg = (userName) => {
    socket.emit("hi", `${socket.id}`, userName)
}

if (typeof window !== "undefined") {
    RTCPeerConnection = window.RTCPeerConnection
    RTCSessionDescription = window.RTCSessionDescription
}

const getAVPermissions = () => {
    navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
          const localVideo = document.getElementById("local-video");
          if (localVideo) {
            localVideo.srcObject = stream;
          }
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
        },
        error => {
          console.warn(error.message);
        }
    )
}

const setupRTC = () => {
    peerConnection = new RTCPeerConnection({
        iceServers: [
            {urls: 'stun:stun.l.google.com:19302'}
        ]
    });

    peerConnection.addEventListener('icecandidate', e => onIceCandidate(peerConnection, e))
    peerConnection.addEventListener('iceconnectionstatechange', e => onIceStateChange(peerConnection, e))

    peerConnection.ontrack = function({ streams }) {
        console.log("got steam : ", streams)
       const remoteVideo = document.getElementById("remote-video");
       if (remoteVideo) {
         remoteVideo.srcObject = streams[0];
       }
    }
}

const callUser = async (peerId) => {
   console.log("calling peer : ", peerId)
   let ve1 = document.querySelector(".video-chat-container")
   if(ve1 && ve1.style) {
    if(ve1.style.visibility !== "visible") {
        window.sendChannel = peerConnection.createDataChannel('sendDataChannel');
        sendChannel.binaryType = 'arraybuffer';
        console.log('Created send data channel');

        sendChannel.addEventListener('open', onSendChannelStateChange);
        sendChannel.addEventListener('close', onSendChannelStateChange);
        sendChannel.addEventListener('error', error => console.error('Error in sendChannel:', error));    
    }
    ve1.style.visibility = "visible"
   }
   const offer = await peerConnection.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  });
  
  console.log("offer : ", offer)
   await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
   sessionStorage.setItem("video-initiator", true)
   socket.emit("rtc-vchat-conn-offer", socket.id, peerId, offer)
}

const getName = () => "name"

const onIceCandidate = async (pc, event) => {
  const peerId = sessionStorage.getItem("peerId")
  if(event.candidate) {
    socket.emit("rtc-add-icecandidate", event.candidate, peerId)
  }
 
  console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

const onIceStateChange = (pc, event) => {
  if (pc) {
    console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
}

const sendData = (file) => {
    if(!file) {
      return
    }
    console.log(`File is ${[file.name, file.size, file.type, file.lastModified].join(' ')}`);
  
    // Handle 0 size files.
    // statusMessage.textContent = '';
    downloadAnchor.textContent = '';
    // if (file.size === 0) {
    //   // bitrateDiv.innerHTML = '';
    //   statusMessage.textContent = 'File is empty, please select a non-empty file';
    //   // closeDataChannels();
    //   return;
    // }
    // sendProgress.max = file.size;
    // receiveProgress.max = file.size;
    const chunkSize = 16384;
    const fileReader = new FileReader();
    let offset = 0;
    fileReader.addEventListener('error', error => console.error('Error reading file:', error));
    fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
    fileReader.addEventListener('load', e => {
      console.log('FileRead.onload ', e);
      sendChannel.send(e.target.result);
      offset += e.target.result.byteLength;
      // sendProgress.value = offset;
      if (offset < file.size) {
        readSlice(offset);
      }
    });
    const readSlice = o => {
      console.log('readSlice ', o);
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };
    readSlice(0);
  }

  const closeDataChannels = () => {
    console.log('Closing data channels');
    if(typeof sendChannel !== 'undefined') {
      sendChannel.close();
      console.log(`Closed data channel with label: ${sendChannel.label}`);
    }
    if (receiveChannel) {
      receiveChannel.close();
      console.log(`Closed data channel with label: ${receiveChannel.label}`);
    }
    peerConnection.close();
    // remoteConnection.close();
    peerConnection = null;
    // remoteConnection = null;
    console.log('Closed peer connections');
  }
  
  const onSendChannelStateChange = () => {
    const readyState = sendChannel.readyState;
    console.log(`Send channel state is: ${readyState}`);
    if (readyState === 'open') {
      const initiator = sessionStorage.getItem("video-initiator")
      console.log("initiator : ", initiator)
      if(initiator) {
        sendData();
      }
    }
  }
  
  const receiveChannelCallback = (event) => {
    console.log('Receive Channel Callback');
    receiveChannel = event.channel;
    receiveChannel.binaryType = 'arraybuffer';
    receiveChannel.onmessage = onReceiveMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
  
    receivedSize = 0;
    bitrateMax = 0;
    let downloadAnchor = document.querySelector('a#download');
    downloadAnchor.textContent = '';
    downloadAnchor.removeAttribute('download');
    if (downloadAnchor.href) {
      URL.revokeObjectURL(downloadAnchor.href);
      downloadAnchor.removeAttribute('href');
    }
  }
  
  const onReceiveMessageCallback = (event) => {
    console.log(`Received Message ${event.data.byteLength}`);
    receiveBuffer.push(event.data);
    receivedSize += event.data.byteLength;
  
    // receiveProgress.value = receivedSize;
  
    // we are assuming that our signaling protocol told
    // about the expected file size (and name, hash, etc).
    // const file = fileInput.files[0];
    if (receivedSize === sentFileSize) {
        console.log("file transferred ok")
      const received = new Blob(receiveBuffer);
      receiveBuffer = [];
      let downloadAnchor = document.querySelector('a#download');
      console.log("downloadAnchor : ", downloadAnchor)
      downloadAnchor.href = URL.createObjectURL(received);
      downloadAnchor.download = sentFileName;
      downloadAnchor.textContent =
        `Click to download '${sentFileName}' (${sentFileSize} bytes)`;
      downloadAnchor.style.display = 'block';
      downloadAnchor.style.color = 'red';
  
      const bitrate = Math.round(receivedSize * 8 /
        ((new Date()).getTime() - timestampStart));
      // bitrateDiv.innerHTML =
      //   `<strong>Average Bitrate:</strong> ${bitrate} kbits/sec (max: ${bitrateMax} kbits/sec)`;
  
    //   if (statsInterval) {
    //     clearInterval(statsInterval);
    //     statsInterval = null;
    //   }
  
      // closeDataChannels();
    }
  }
  
  const onReceiveChannelStateChange = async () => {
    const readyState = receiveChannel.readyState;
    console.log(`Receive channel state is: ${readyState}`);
    if (readyState === 'open') {
      timestampStart = (new Date()).getTime();
      timestampPrev = timestampStart;
      // statsInterval = setInterval(displayStats, 500);
      // await displayStats();
    }
  }


const RTCHome = () => {
    const [peers, setPeers] = useState([])
    const [userName, setUserName] = useState("")
    const [file, setFile] = useState("")
    useEffect(() => {
        console.log("Rendering")
        setUpSocketEvents(setPeers)
        getAVPermissions()
        setupRTC()
    }, [])

    const renderPeers = () => {
        return(
            peers.map(peer => {
                return (
                    <div key={peer.id}>
                    <span className="w-1/2 bg-gray-200 border border-double border-red-200 rounded-md py-2 my-2">
                        {peer.id} --- {peer.name}
                    </span>
                    <button 
                        className="w-20 mr-10 rounded-md bg-blue-500 text-white"
                        onClick={() => {callUser(peer.id); sessionStorage.setItem("peerId", peer.id)}}>Video Call</button>
                    </div>
                )
            })
        )
    }

    const changeUserName = (e) => {
        const name = e.target.value
        setUserName(name)
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        if (!file) {
            console.log('No file chosen');
        } else {
            setFile(file)
            const peerId = sessionStorage.getItem("peerId")
            socket.emit("send-file-size", peerId, file.size, file.name )
        }
    }

    return (
        <div>
            <p>RTC Home</p>
            <div className="my-10">
             {renderPeers()}
            </div>
            <div className="my-10 flex flex-row justify-start content-center">
                <input
                    type="text"
                    className="w-60 text-sm text-black placeholder-gray-500 border border-blue-200 rounded-md py-2 pl-10"
                    placeholder="your name"
                    value={userName}
                    onChange={changeUserName}
                />
                <button className="w-20 ml-10 rounded-md bg-green-500 text-white"
                    onClick={() => {sendMsg(userName); setUserName("")}}>Set Name</button>
            </div>
            <div>
                <input type="file" id="fileInput" name="files" onChange={handleFileInputChange}/>
                <button className="w-20 mr-10 rounded-md bg-blue-500 text-white"
                     id="sendFile" onClick={() => sendData(file)}>Send</button>
                <div>
                    <a id="download"></a>
                    <span id="status"></span>
                </div>
            </div>
            <div className="video-chat-container">
                <div className="video-container">
                    <video autoPlay className="remote-video" id="remote-video"></video>
                    <video autoPlay muted className="local-video" id="local-video"></video>
                </div>
            </div>
            <style jsx>{`
                .video-chat-container {
                    padding: 0 20px;
                    flex: 1;
                    position: relative;
                    margin-left: 30px;
                    margin-top: 100px;
                    visibility: hidden;
                }
                .remote-video {
                    border: 1px solid #cddfe7;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                }
                    
                .local-video {
                    position: absolute;
                    border: 1px solid #cddfe7;
                    bottom: 20px;
                    right: 40px;
                    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                    border-radius: 5px;
                    width: 150px;
                }
            `}</style>
        </div>
    )
}

export default RTCHome