import { useEffect, useState } from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Video = ({ leaveRoom, onIconClick, roomState, buttonState }) => {
  const [isLoading, setIsLoading] = useState(true);
  let localStreamChildrenLength = 0;

  useEffect(() => {
    const localStreamElement = document.querySelector("#local-stream");
    localStreamChildrenLength = localStreamElement.children.length;
    console.log(localStreamChildrenLength);
    if (localStreamChildrenLength < 1) {
      setIsLoading(true);
      return;
    }

    // setIsLoading(false);
  }, [localStreamChildrenLength]);

  const { roomName, roomID } = useSelector((state) => state.room);

  const muteAudioClass = buttonState.muteAudio
    ? "falseVideoBtn"
    : "validVideoBtn";
  const hideVideoClass = buttonState.hideVideo
    ? "falseVideoBtn"
    : "validVideoBtn";

  return (
    <div>
      <div id="main-container" className="constrain">
        <div id="main-hub" className="panel">
          <div className="room-info">
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
            </div>
          </div>
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
        <div id="remote-streams" className="panel">
          <div className="info">Invite</div>
        </div>
        <div id="video-controls" className="panel">
          <button
            className={`btn ${muteAudioClass} uniformRound`}
            onClick={onIconClick}
            id="muteAudio"
          >
            <GoUnmute color="white" size={30} />
          </button>
          <button id="exit" className="btn falseVideoBtn" onClick={leaveRoom}>
            LEAVE
          </button>
          <button
            className={`btn ${hideVideoClass} uniformRound`}
            onClick={onIconClick}
            id="hideVideo"
          >
            <BsFillCameraVideoFill color="white" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
