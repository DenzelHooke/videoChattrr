import { useState, useEffect } from "react";
import Panel from "./Panel";
import Form from "./Form";
import FriendsForm from "./FriendsForm";
import { IoPeopleCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const Friends = () => {
  const { user } = useSelector((state) => state.auth);
  const [authToken, setAuthToken] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (!authToken) {
      setAuthToken(user.token);
    } else if (!config) {
      setConfig({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }
  }, [user, authToken, config]);

  const [friends, setFriends] = useState();

  const getUsers = async (search_value) => {};

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
