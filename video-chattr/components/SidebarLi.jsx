import React from "react";

const SidebarLi = ({ item, btn1, btn2, onClick, type }) => {
  console.log(item);
  return (
    <li className="sidebar-li">
      <p>
        {type === "savedRooms"
          ? item.roomName
          : type === "friendRequests"
          ? item.username
          : type === "friends" && item.username}
      </p>
      <div className="btns ui-wrapper">
        <button
          className="btnBlock longBtn successBg"
          id="goodBtn"
          onClick={(e) => onClick({ e: e, value: item, type })}
        >
          {type === "friends" && item.currentRoom ? "Join room" : btn1}
        </button>
        <button
          className="btnBlock longBtn dangerBg"
          id="badBtn"
          onClick={(e) => onClick({ e: e, value: item, type })}
        >
          {btn2}
        </button>
      </div>
    </li>
  );
};

export default SidebarLi;
