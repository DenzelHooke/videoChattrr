import React from "react";

const Panel = ({ form, classes, component, id }) => {
  return (
    <>
      <div id={`${id}`} className={`panel-constrain panel ${classes} `}>
        {form}
        {component}
      </div>
    </>
  );
};

export default Panel;
