import React from "react";

const LoadingCircle = ({ classes }) => {
  return (
    <div id="loading" className={`${classes}`}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingCircle;
