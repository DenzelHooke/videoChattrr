import React from "react";
import Panel from "./Panel";
import Form from "./Form";
import FriendsForm from "./FriendsForm";
import { IoPeopleCircleSharp } from "react-icons/io5";

const Friends = () => {
  return (
    <div className="center">
      <Panel
        classes={""}
        form={
          <Form
            form={<FriendsForm />}
            svg={<IoPeopleCircleSharp size={50} />}
            className="friend-form"
            message="Add Friends"
          />
        }
      />
    </div>
  );
};

export default Friends;
