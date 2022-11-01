import { useEffect, useState } from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import LoadingCircle from "./LoadingCircle";
import TestVideoElements from "./TestVideoElements";
import { useRouter } from "next/router";
import { BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const Video = ({ leaveRoom, muteLocal, hideLocal, onIconClick, roomState }) => {
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

  const onClick = (e) => {
    console.log(e);
  };

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
          {/* <TestVideoElements /> */}
          {/* {document.querySelector("#remote-streams").children.length < 1 && (
            <>
              <p>No users yet..</p>
            </>
          )} */}
          <div className="info">Invite</div>
        </div>
        <div id="video-controls" className="panel">
          <div className="btn true" onClick={muteLocal}>
            <GoUnmute color="white" size={30} />
          </div>
          <button id="exit" className="btn false" onClick={leaveRoom}>
            LEAVE
          </button>
          <div className="btn true" onClick={hideLocal}>
            <BsFillCameraVideoFill color="white" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
