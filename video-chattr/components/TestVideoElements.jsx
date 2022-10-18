import React from "react";

function TestVideoElements() {
  return (
    <>
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
    </>
  );
}

export default TestVideoElements;
