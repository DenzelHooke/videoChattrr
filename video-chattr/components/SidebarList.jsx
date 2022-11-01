import React from "react";
import SidebarLi from "./SidebarLi";

const SidebarList = ({ data, arr, onClick, type }) => {
  const { options } = data;

  const generateUID = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };
  return (
    <ul className="sidebar-ul">
      {arr.map((item) => {
        return (
          <SidebarLi
            onClick={onClick}
            key={generateUID()}
            item={item}
            btn1={options.btn1}
            btn2={options.btn2}
            type={type}
          />
        );
      })}
    </ul>
  );
};

export default SidebarList;
