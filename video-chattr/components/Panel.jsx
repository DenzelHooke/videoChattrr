import React from "react";

const Panel = ({ form, classes }) => {
  return <div className={`panel-constrain panel ${classes} `}>{form}</div>;
};

export default Panel;
