import React from "react";
import axios from "axios";

class Rooms {
  #token = null;
  #client = null;
  #appID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  constructor(roomName, uid) {
    this.roomName = roomName;
    this.uid = uid;
  }

  // /**
  //  * @param {str} token
  //  */
  // set token(token) {
  //   this.#token = token;
  //   console.log(this.#token);
  // }

  async init(token) {
    console.log(process.env.NEXT_PUBLIC_AGORA_APP_ID);
    console.log("INIT: ", token);
    this.#token = token;
    this.#client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    console.log("client: ", this.#client);
    //Init client
    this.#client.init(
      process.env.NEXT_PUBLIC_AGORA_APP_ID,
      () => {
        this.joinChannel();
      },
      (err) => {
        console.log.warn("[ERROR] - Agora client failed to initialize!");
      }
    );
  }

  async joinChannel() {
    console.warn("joining ", this.roomName);
  }
}

export default Rooms;
