import { getUserFromRunningRoom } from "../helpers/RoomsFuncs";
import AgoraRTC from "agora-rtc-sdk-ng";
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
    this.streamOptions = {
      // Pass your App ID here.
      appId: this.#appID,
      // Set the channel name.
      channel: this.roomID,
      // Pass your temp token here.
      token: this.#token,
      // Set the user ID.
      uid: this.uid,
    };
  }

  // /**
  //  * @param {str} token
  //  */

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
    console.log("initializing client");
    this.#token = token;
    this.#client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    console.log("client: ", this.#client);
    //Init client
    this.setUpHooks();
    if (!this.#client) {
      console.error("[ERROR] - Agora client failed to initialize!");
    }

    this.joinChannel();
  }

  muteLocal() {
    return new Promise((resolve, reject) => {
      try {
        // Mute/unmute client's local audio for other users.

        // Runs if client is already muted
        if (this.isMuted) {
          this.isMuted = false;
          this.localStreams.camera.stream.audio.setMuted(false);
          resolve(this.isMuted);
          return;
        }
        // If not muted, mute.
        this.isMuted = true;
        this.localStreams.camera.stream.audio.setMuted(true);
        resolve(this.isMuted);
      } catch (error) {
        reject(error);
      }
    });
  }

  hideCameraLocal() {
    // Mute/unmute client's local audio for other users.
    return new Promise((resolve, reject) => {
      try {
        //If already hidden, unhide camera.
        if (this.hideCamera) {
          this.hideCamera = false;
          //! Disabled
          // this.localStreams.camera.stream.video.setMuted(false);
          resolve(this.hideCamera);
          return;
        }

        // If not hidden, hide camera.
        this.hideCamera = true;
        //! Disabled
        // this.localStreams.camera.stream.video.setMuted(true);
        resolve(this.hideCamera);
      } catch (error) {
        reject(error);
      }
    });
  }

  async joinChannel() {
    console.log("Joining channel");
    // joins channel and creates camera stream object.

    // this.setUpHooks();

    await this.#client.join(this.#appID, this.roomID, this.#token, this.uid);

    this.localStreams.camera.id = this.uid;
    this.createCameraStream();
  }

  createLocalElement() {
    const promise = new Promise((resolve, reject) => {
      try {
        const localStreamContainer = document.querySelector("div#local-stream");

        // const localStreamElement = document.createElement("div");
        // localStreamElement.id = `${this.uid}`;
        // localStreamContainer.appendChild(this.localStreams.camera.stream.video);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  async createCameraStream() {
    console.log("UID: ", this.uid);
    console.log("Creating stream objects");
    const streamTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
    const localAudio = streamTrack[0];
    const localVideo = streamTrack[1];
    localAudio.setEnabled(true);
    console.log(streamTrack);
    // const localAudio = await AgoraRTC.createMicrophoneAudioTrack();
    // console.log("LOCAL AUDIO: ", localAudio);
    // const localVideo = await AgoraRTC.createCameraVideoTrack({
    //   encoderConfig: {
    //     width: 640,
    //     // Specify a value range and an ideal value
    //     height: { ideal: 480, min: 400, max: 500 },
    //     frameRate: 30,
    //     bitrateMin: 600,
    //     bitrateMax: 1000,
    //   },
    // });
    // console.log(localVideo);
    // localStream.setVideoProfile(this.cameraVideoProfile);
    if (localAudio && localVideo) {
      this.localStreams.camera.stream.video = localVideo;
      this.localStreams.camera.stream.audio = localAudio;
      console.log("GetUserMedia successful!");
      this.localStreams.camera.stream.video.play("local-stream");

      //Add ID to localstream
      document.querySelector("div#local-stream").classList.add(this.uid);

      console.log("LOCAL STREAM: ", this.localStreams);

      await this.#client.publish([localAudio, localVideo], (err) => {
        console.error("[ERROR] : Publishing stream failed.", err);
      });
    }
  }
  setUpHooks() {
    try {
      this.#client.on("user-published", async (user, mediaType) => {
        console.log("stream published: ", user, mediaType);
        console.log("myID: ", this.localStreams.camera.id);
        console.log("userID: ", user.uid);
        const streamID = user.uid;

        // Check if stream is local
        if (streamID === this.localStreams.camera.id) {
          return;
        }
        await this.#client.subscribe(user, mediaType);
        console.log("user: ", user);

        // Assign property
        this.remoteStreams[streamID] = {
          camera: {
            id: streamID,
            stream: {},
          },
        };
        //Run when video track is published
        if (mediaType === "video") {
          // Once we subscribe, we have access to the getter videoTrack attribute.
          console.log(user);
          // user.videoTrack.setVideoProfile(this.cameraVideoProfile);

          // Set object properties
          this.remoteStreams[streamID].camera.stream.video = user.videoTrack;
          const videoTrack = this.remoteStreams[streamID].camera.stream.video;

          this.addVideoStream({
            streamID,
            remoteStream: videoTrack,
          });
        }
        //Run when audio track is published
        else if (mediaType === "audio") {
          // Set object properties
          console.log("Playing audio track");
          this.remoteStreams[streamID].camera.stream.audio = user.audioTrack;
          this.remoteStreams[streamID].camera.stream.audio.play();
        }
      });
    } catch (error) {
      console.error("[ERROR] - ", error);
    }
  }

  async addVideoStream({ streamID, remoteStream }) {
    // const remoteStream = this.remoteStreams[streamID].camera.stream.video;
    console.log("REMOTE: ", remoteStream);
    const remoteID = streamID;

    try {
      console.log("BEFORE getUser");
      console.log(remoteID);
      //TODO Call api func to return username with same uid from stream to get a username as a string.
      const res = await getUserFromRunningRoom(this.roomID, remoteID);
      //! Throw err is no res.data.
      if (!res.data) {
        throw new Error(
          "Couldn't add connecting user stream because user could not be found on server."
        );
      }
      console.log("AFTER getUser");

      const { user } = res.data;

      //* Add user stream to dom
      const peerStreams = document.querySelector("#remote-streams");

      // peerStreams.append(new_video);
      const remoteStreamContainer = document.createElement("div");
      remoteStreamContainer.className = "streamContainer";
      remoteStreamContainer.id = remoteID;
      const info = document.createElement("p");
      info.className = "info";

      info.innerText = user.username;

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

  async addAudioStream({ streamID, remoteStream }) {
    remoteStream.play();
  }

  removeRemoteStream(uid) {
    console.log("removing stream: ", uid);
    try {
      console.log(`Removing stream ${uid}`);
      const remoteStream = this.remoteStreams[uid];
      console.log("REMOTE STREAM: ", remoteStream);

      const remoteStreamElement = document.getElementById(`${uid}`);
      remoteStreamElement.remove();
      console.log(remoteStreamElement);

      delete this.remoteStreams[uid];
      // this.#client.unsubscribe(remoteStream.camera.stream);
    } catch (error) {
      console.error(error);
    }
  }

  removeLocalStream() {
    try {
      console.log("Removing local stream!");

      const videoStream = this.localStreams.camera.stream.video;
      const audioStream = this.localStreams.camera.stream.audio;
      console.log("Remvoing local stream.");
      audioStream.close();
      videoStream.close();
      this.#client.leave();
      console.log("Done removing local stream!");
    } catch (error) {
      console.error("Error while attempting to remove local stream: ", error);
    }
  }
}

export default Rooms;
