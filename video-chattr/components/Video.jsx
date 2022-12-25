import { useEffect, useState } from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Video = ({ leaveRoom, onIconClick, roomState, buttonState }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [remoteStreamsHide, setRemoveStreamsHide] = useState(false);
  const [remoteStreamsChildrenLength, setRemoteStreamsChildrenLength] =
    useState(0);
  let localStreamChildrenLength = 0;

  const { roomName, roomID } = useSelector((state) => state.room);
  const { roomSaved, setRoomSaved } = useState(false);

  const muteAudioClass = buttonState.muteAudio
    ? "falseVideoBtn"
    : "validVideoBtn";
  const hideVideoClass = buttonState.hideVideo
    ? "falseVideoBtn"
    : "validVideoBtn";

  useEffect(() => {
    if (localStreamChildrenLength < 1) {
      setIsLoading(true);
      return;
    }

    const localStreamElement = document.querySelector("#local-stream");
    localStreamChildrenLength = localStreamElement.children.length;
    console.log(localStreamChildrenLength);
    setIsLoading(false);
  }, [localStreamChildrenLength]);

  useEffect(() => {
    const remoteStreamContainer = document.querySelector("div#remote-streams");
    console.log(remoteStreamContainer.children);
    setRemoteStreamsChildrenLength(remoteStreamContainer.children.length);
    if (remoteStreamContainer.children.length > 0) {
      console.log("greter then---");
    }
  }, []);

  return (
    <div id="main-container" className="constrain">
      <div id="room-info">
        <div id="immediate-room-info">
          <h1>
            <span className="room-name">{roomName}</span>
          </h1>
          <div className="roomID">Room ID: {roomID}</div>
        </div>
        <div className="room-icons">
          {roomState.saveVideo ? (
            <button
              id="saveVideo"
              className="button successBg"
              onClick={onIconClick}
            >
              Roomed Pinned
            </button>
          ) : (
            <button
              id="saveVideo"
              className="button azureBg"
              onClick={onIconClick}
            >
              Pin Room
            </button>
          )}
          <div className="center-icons flexRow flex">
            <button
              className={`btn ${hideVideoClass} round`}
              onClick={onIconClick}
              id="hideVideo"
            >
              <BsFillCameraVideoFill
                color="white"
                size={30}
                className="no-click-svg"
              />
            </button>
            <button
              className={`btn ${muteAudioClass} round`}
              onClick={onIconClick}
              id="muteAudio"
            >
              <GoUnmute color="white" size={30} className="no-click-svg" />
            </button>
          </div>
          <div className="important">
            <button id="exit" className="btn falseVideoBtn" onClick={leaveRoom}>
              LEAVE
            </button>
          </div>
        </div>
      </div>
      <div id="main-hub">
        <div id="local-stream" className="focus">
          {/* <div id="local-element">
              <video
                src="./test/test_mountain.mp4"
                className="video"
                autoplay="true"
                loop="true"
              ></video>
            </div> */}
        </div>
      </div>
      <div id="remote-streams">{/* <div className="info">Invite</div> */}</div>
      {/* <div id="video-controls" className="hide">
        <button
          className={`btn ${muteAudioClass} uniformRound`}
          onClick={onIconClick}
          id="muteAudio"
        >
          <GoUnmute
            color="white"
            size={30}
            onClick={() => onIconClick("muteAudio")}
          />
        </a>
        <button id="exit" className="btn falseVideoBtn" onClick={leaveRoom}>
          LEAVE
        </button>
        <button
          className={`btn ${hideVideoClass} uniformRound`}
          onClick={() => onIconClick("hideVideo")}
          id="hideVideo"
        >
          <BsFillCameraVideoFill
            color="white"
            size={30}
            className="no-click-svg"
          />
        </button>
      </div> */}
    </div>
  );
};

export default Video;
