import React from "react";
import axios from "axios";

class Rooms {
  #token = null;
  #client = null;
  #appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  constructor(roomName, uid) {
    this.roomName = roomName;
    this.uid = uid;
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
    this.cameraVideoProfile = "1080p_5";
  }

  // /**
  //  * @param {str} token
  //  */
  // set token(token) {
  //   this.#token = token;
  //   console.log(this.#token);
  // }

  async init(token) {
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

  async joinChannel() {
    // joins channel and creates camera stream object.

    //! Attach hooks.
    this.setUpHooks();

    this.#client.join(this.#token, this.roomName, this.uid, () => {
      this.createCameraStream();
      this.localStreams.camera.id = this.uid;
    });
  }

  async createCameraStream() {
    const localStream = AgoraRTC.createStream({
      streamID: this.uid,
      audio: false,
      video: true,
      screen: false,
    });
    localStream.setVideoProfile(this.cameraVideoProfile);
    localStream.init(() => {
      console.log("GetUserMedia successful!");
      localStream.play("local-stream");

      const streamElement = document.querySelector("#local-stream").children[0];
      this.localStreams.camera.element = streamElement;
      streamElement.classList.add("video");
      streamElement.id = "local-element";
      streamElement.children[0].id = "local-camera";
      this.localStreams.camera.stream = localStream;

      streamElement.removeAttribute("style");
      streamElement.children[0].removeAttribute("style");

      this.#client.publish(localStream, (err) => {
        console.error("[ERROR] : Publishing stream failed.", err);
      });
    });
  }

  setUpHooks() {
    this.#client.on("stream-added", (e) => {
      const stream = e.stream;
      const streamID = stream.getId();
      console.log(`__-- Stream added: `, e.stream);
      // Check if stream is local
      if (streamID != this.localStreams.camera.id) {
        stream.setVideoProfile(this.cameraVideoProfile);
        this.#client.subscribe(stream, (err) => {
          console.log("[ERROR] : Subscribe to stream has failed.", err);
        });
      }
    });

    this.#client.on("stream-subscribed", (e) => {
      const remoteStream = e.stream;
      const remoteID = remoteStream.getId();
      this.remoteStreams[remoteID] = remoteStream;
      console.log("Subscribed to remote stream successfully: " + remoteID);
      this.addStream(remoteStream, remoteID);
    });
  }

  async addStream(remoteStream, remoteID) {
    const peerStreams = document.querySelector("#remote-streams");

    // peerStreams.append(new_video);
    await remoteStream.play(`remote-streams`, {}, () => {
      console.log("stream added to DOM!");
      console.log(peerStreams);
      for (let i = 0; i < peerStreams.children.length; i++) {
        // removes default styles on all video container elements set by agoraSDK
        console.log(peerStreams[0]);
        const videoContainer = peerStreams.children[i];
        const videoElement = peerStreams.children[i].children[0];

        videoContainer.removeAttribute("style");
        // Removes the style attributes on the video element
        videoElement.removeAttribute("style");
        videoElement.classList.add("video");
      }
    });
  }
}

export default Rooms;
