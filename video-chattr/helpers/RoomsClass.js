import { getUserFromRunningRoom } from "../helpers/RoomsFuncs";

class Rooms {
  #token = null;
  #client = null;
  #appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  #hasAudio = true;
  #hasVideo = true;

  constructor(roomID, uid, username) {
    console.log(`RoomID: ${roomID}\n uid: ${uid}\n username: ${username}`);
    console.log("Initializing room client.");
    this.videoProfile = "1080p_5";
    this.roomID = roomID;
    this.username = username;
    this.uid = uid;
    this.isMuted = false;
    this.hideCamera = false;
    this.localStreams = {
      camera: {
        id: null,
        stream: {},
        element: null,
      },
      screen: {
        id: null,
        stream: {},
        element: null,
      },
    };
    this.remoteStreams = {};
    this.cameraVideoProfile = this.videoProfile;
  }

  // /**
  //  * @param {str} token
  //  */
  // set token(token) {
  //   this.#token = token;
  //   console.log(this.#token);
  // }
  getStream() {
    return this.localStream;
  }
  reset() {
    this.roomID = null;
    this.username = null;
    this.uid = null;
    this.localStreams = {
      camera: {
        id: null,
        stream: {},
        element: null,
      },
      screen: {
        id: null,
        stream: {},
        element: null,
      },
    };
    this.remoteStreams = {};
    this.cameraVideoProfile = this.videoProfile;
  }
  init(token) {
    this.#token = token;
    this.#client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    console.log("client: ", this.#client);
    //Init client
    this.#client.init(
      this.#appID,
      () => {
        this.joinChannel();
      },
      (err) => {
        console.log.warn("[ERROR] - Agora client failed to initialize!");
      }
    );
  }

  muteLocal() {
    // Mute/unmute client's local audio for other users.

    // Runs if client is already muted
    if (this.isMuted) {
      this.isMuted = false;
      this.localStreams.camera.stream.unmuteAudio();
      return;
    }
    this.isMuted = true;
    this.localStreams.camera.stream.muteAudio();
  }

  hideCameraLocal() {
    // Mute/unmute client's local audio for other users.

    // Runs if client is already muted
    if (this.hideCamera) {
      this.hideCamera = false;
      this.localStreams.camera.stream.unmuteVideo();
      return;
    }
    this.hideCamera = true;
    this.localStreams.camera.stream.muteVideo();
  }

  async joinChannel() {
    // joins channel and creates camera stream object.

    this.setUpHooks();

    this.#client.join(this.#token, this.roomID, this.uid, () => {
      this.localStreams.camera.id = this.uid;
      this.createCameraStream();
    });
  }

  async createCameraStream() {
    const localStream = AgoraRTC.createStream({
      streamID: this.uid,
      audio: this.#hasAudio,
      video: this.#hasVideo,
      screen: false,
    });
    localStream.setVideoProfile(this.cameraVideoProfile);
    localStream.init(() => {
      console.log("GetUserMedia successful!");
      localStream.play("local-stream");
      console.log("LOCAL STREAM: ", localStream);
      // const streamElement = document.querySelector("#local-stream").children[0];
      // this.localStreams.camera.element = streamElement;
      // streamElement.classList.add("video");
      // streamElement.id = "local-element";
      // streamElement.children[0].id = "local-camera";
      this.localStreams.camera.stream = localStream;
      // streamElement.removeAttribute("style");
      // streamElement.children[0].removeAttribute("style");

      this.#client.publish(localStream, (err) => {
        console.error("[ERROR] : Publishing stream failed.", err);
      });
    });
  }

  setUpHooks() {
    this.#client.on("stream-added", (e) => {
      const stream = e.stream;
      const streamID = stream.getId();
      // Check if stream is local
      if (streamID != this.localStreams.camera.id) {
        console.log(`__-- Stream added: `, e.stream);
        stream.setVideoProfile(this.cameraVideoProfile);
        this.#client.subscribe(stream, (err) => {
          console.log("[ERROR] : Subscribe to stream has failed.", err);
        });
      }
    });

    this.#client.on("stream-subscribed", (e) => {
      const remoteStream = e.stream;
      const remoteID = remoteStream.getId();
      this.remoteStreams[remoteID] = {
        camera: {
          stream: remoteStream,
          id: null,
          element: null,
        },
      };
      this.remoteStreams[remoteID].camera.id = remoteID;

      console.log("Subscribed to remote stream successfully: " + remoteID);
      this.addStream(remoteStream);
    });
  }

  async addStream(remoteStream) {
    console.log("REMOTE: ", remoteStream);
    const remoteID = remoteStream.getId();

    try {
      console.log("BEFORE getUser");
      console.log(remoteID);
      //TODO Call api func to return username with same uid from stream to get a username as a string.
      const res = await getUserFromRunningRoom(this.roomID, remoteID);
      console.log("AFTER getUser");

      //! Throw err is no res.data.
      if (!res.data) {
        throw new Error(
          "Couldn't add connecting user stream because user could not be found on server."
        );
      }

      const { exists, user } = res.data;

      //* Add user stream to dom
      const peerStreams = document.querySelector("#remote-streams");

      // peerStreams.append(new_video);
      const remoteStreamContainer = document.createElement("div");
      remoteStreamContainer.className = "streamContainer";
      remoteStreamContainer.id = remoteID;
      const info = document.createElement("p");
      info.className = "info";

      info.innerText = user["username"];

      remoteStreamContainer.appendChild(info);
      peerStreams.appendChild(remoteStreamContainer);
      console.log(peerStreams);

      //* Play user stream in dom.
      await remoteStream.play(`${remoteID}`, {}, () => {
        console.log("stream added to DOM!");
        console.log(peerStreams);
        for (let i = 0; i < peerStreams.children.length; i++) {
          //* Remove default style attributes on video elements set by AgoraSDK.
          const videoElement = peerStreams.children[i].children[0];

          // videoContainer.removeAttribute("style");
          // Removes the style attributes on the video element
          videoElement.removeAttribute("style");
          videoElement.classList.add("video");
        }
      });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  removeRemoteStream(uid) {
    try {
      console.log(`Removing stream ${uid}`);
      const remoteStream = this.remoteStreams[uid];
      console.log("REMOTE STREAM: ", remoteStream);
      //TODO Find stream with uid
      //? Maybe use element ID.

      delete this.remoteStreams[uid];

      //TODO Remove from dom
      const remoteStreamElement = document.getElementById(`${uid}`);
      remoteStreamElement.remove();
      console.log(remoteStreamElement);

      //TODO Unsubsribe

      this.#client.unsubscribe(remoteStream.camera.stream);
    } catch (error) {}
  }

  removeLocalStream() {
    try {
      const remoteStreamElement = document.getElementById(`${this.uid}`);
      remoteStreamElement.remove();
      const localStream = this.localStreams.camera.stream;
      console.log("Remvoing local stream.");
      localStream.stop();
      localStream.close();
    } catch (error) {}
  }
}

export default Rooms;
