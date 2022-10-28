import React from "react";
import SidebarLi from "./SidebarLi";

const SidebarList = ({ data }) => {
  const arr = data.arr;
  const generateUID = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };
  return (
    <ul className="sidebar-ul">
      {arr.map((item) => {
        return (
          <SidebarLi
            key={generateUID()}
            item={item}
            btn1={data.options.btn1}
            btn2={data.options.btn2}
          />
        );
      })}
    </ul>
  );
};

export default SidebarList;
