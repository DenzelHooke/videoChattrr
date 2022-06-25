import React from "react";
import axios from "axios";

class Rooms {
  #token;
  #roomName;
  #appID;
  #uid;

  constructor(roomName) {
    this.#token = null;
    this.#roomName = roomName;
    this.#appID = null;
    this.#uid = null;
  }

  async initAgora() {
    await this.createToken("http://localhost:8080/auth/createToken/")
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    this.client.init(this.#appID, () => {

    });
  }

  async createToken(endpoint) {
    const res = await axios.post(endpoint, {
      channel: roomName,
      isPublisher: false,
    });

    this.#token = res.data.token;
    this.#roomName = res.data.roomName;
    this.#appID = res.data.appID;
    this.#uid = res.data.uid;
  }

  async joinRoom(uid)
}
