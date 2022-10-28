import React from "react";

const SidebarLi = ({ item, btn1, btn2 }) => {
  return (
    <li className="sidebar-li">
      <p>{item.value1}</p>
      <div className="btns ui-wrapper">
        <button className="btnBlock longBtn successBg" id="goodBtn">
          {btn1}
        </button>
        <button className="btnBlock longBtn dangerBg" id="badBtn">
          {btn2}
        </button>
      </div>
    </li>
  );
};

export default SidebarLi;
