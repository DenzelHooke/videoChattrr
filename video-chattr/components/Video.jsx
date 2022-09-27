import React from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Video = () => {
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
            <div id="local-element">
              <video
                src="./test/test_mountain.mp4"
                className="video"
                autoplay="true"
                loop="true"
              ></video>
            </div>
          </div>
        </div>
        <div id="remote-streams" className="panel">
          <div className="streamContainer">
            <p className="info">John Snow</p>
            <div className="userControls">
              <div className="btn true">
                <GoUnmute color="white" size={30} />
              </div>
              <div className="btn true">
                <BsFillCameraVideoFill color="white" size={30} />
              </div>
            </div>
            <video
              src="./test/test_selfie1.mp4"
              className="video"
              autoplay="true"
              loop="true"
            ></video>
          </div>
          <div className="streamContainer">
            <p className="info">Cock Gobl3rr</p>
            <div className="userControls">
              <div className="btn true">
                <GoUnmute color="white" size={30} />
              </div>
              <div className="btn true">
                <BsFillCameraVideoFill color="white" size={30} />
              </div>
            </div>
            <video
              src="./test/test_selfie2.mp4"
              className="video"
              autoplay="true"
              loop="true"
            ></video>
          </div>
          <div className="streamContainer">
            <p className="info">Goofy Goober</p>
            <div className="userControls">
              <div className="btn true">
                <GoUnmute color="white" size={30} />
              </div>
              <div className="btn true">
                <BsFillCameraVideoFill color="white" size={30} />
              </div>
            </div>
            <video
              src="./test/test_selfie3.mp4"
              className="video"
              autoplay="true"
              loop="true"
            ></video>
          </div>
        </div>
        <div id="video-controls" className="panel">
          <div className="btn true">
            <GoUnmute color="white" size={30} />
          </div>
          <button id="exit" className="btn false">
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
