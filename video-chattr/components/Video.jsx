import { useEffect, useState } from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import LoadingCircle from "./LoadingCircle";
import TestVideoElements from "./TestVideoElements";
import { useRouter } from "next/router";

const Video = ({ leaveRoom }) => {
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

  return (
    <div>
      <div id="main-container" className="constrain">
        <div id="main-hub" className="panel">
          <div id="room-title">
            <h1>
              <span className="room-name">{roomName}</span>
            </h1>
          </div>
          <div className="roomID">Room ID: {roomID}</div>
          <div id="local-stream" className="focus">
            {isLoading && <LoadingCircle />}
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
        </div>
        <div id="video-controls" className="panel">
          <div className="btn true">
            <GoUnmute color="white" size={30} />
          </div>
          <button id="exit" className="btn false" onClick={leaveRoom}>
            LEAVE
          </button>
          <div className="btn true">
            <BsFillCameraVideoFill color="white" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
