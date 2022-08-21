import React from "react";
import { GoUnmute } from "react-icons/go";
import { BsFillCameraVideoFill } from "react-icons/bs";

const Video = ({ roomName }) => {
  return (
    <div>
      <div className="utils constrain">
        <button id="exit">LEAVE</button>
      </div>
      <div id="main-container" className="constrain">
        <div id="main-hub" className="panel">
          <div id="room-title">
            <h1>
              <span className="room-name">{roomName}</span>
            </h1>
          </div>
          <div id="local-stream" className="focus">
            <div id="local-element">
              <video
                src="./test/test_mountain.mp4"
                className="video"
                autoplay
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
              src="./test/test_people_walking.mp4"
              className="video"
              autoplay
            ></video>
          </div>
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
              src="./test/test_people_walking.mp4"
              className="video"
              autoplay
            ></video>
          </div>
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
              src="./test/test_people_walking.mp4"
              className="video"
              autoplay
            ></video>
          </div>
        </div>
      </div>
      <div id="video-controls"></div>
    </div>
  );
};

export default Video;
