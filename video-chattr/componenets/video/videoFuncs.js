export default class RtcUser {
  #_appID = process.env.NEXT_AGORA_APP_ID;

  constructor(channelName) {
    this.channelName = channelName;
  }

  get appID() {
    return this.#_appID;
  }
}
