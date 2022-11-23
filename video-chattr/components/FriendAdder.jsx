import { useState, useEffect } from "react";
import Panel from "./Panel";
import Form from "./Form";
import FriendsForm from "./FriendsForm";
import { sendFriendRequest } from "../helpers/UsersFuncs";
import { IoPeopleCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setResultVisibility } from "../features/users/usersSlice";
import UsersFound from "./UsersFound";
import { setError, setSuccess } from "../features/utils/utilsSlice";

const FriendAdder = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { usersFound, isFriendsLoading } = useSelector((state) => state.users);

  const [authToken, setAuthToken] = useState(null);
  const [config, setConfig] = useState(null);

  const [componenetState, setComponenetState] = useState({
    isCompLoading: false,
  });

  const [formData, setFormData] = useState({
    username: "",
    message: "",
    isError: false,
  });

  useEffect(() => {
    if (formData.isError) {
      dispatch(setError({ message: formData.message }));
      setFormData((prevState) => ({
        ...prevState,
        message: "",
        isError: false,
      }));
      return;
    }
  }, [formData]);

  useEffect(() => {
    const handleClick = (e) => {
      const friendPanel = document.getElementById("friend-panel");
      if (friendPanel.contains(e.target)) {
        console.log("click was INSIDE friend panel");
        return;
      }
      dispatch(setResultVisibility());
      console.log("click was OUTSIDE friend panel");
    };

    try {
      document.addEventListener("click", handleClick);
    } catch (error) {
      dispatch(setError({ message: error.message }));
    }

    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!authToken) {
      setAuthToken(user.token);
    }
    if (authToken && !config) {
      setConfig({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }
  }, [authToken, config]);

  const onSearch = async (userData) => {
    const payload = {
      userData,
      config,
    };
    dispatch(getUsers(payload));
  };

  const onFormChange = (e) => {
    setFormData((...prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Friend Form Submitted!");

    onSearch(formData.username);
  };

  const onAddFriend = async (data) => {
    console.log(data);

    const payload = {
      data: {
        to: data._id,
        from: user._id,
      },
      config: config,
    };
    console.log(payload);
    try {
      const res = await sendFriendRequest(payload);
      if (res.data) {
        console.log(res.data);
        if (res.data.exists) {
          // The recepient hasnt accepted friend req yet.
          setFormData((prevState) => ({
            ...prevState,
            message: res.data.message,
            isError: res.data.exists,
          }));
          return;
        }

        setSuccess({ message: res.data.message });
      }

      console.log(res);
    } catch (error) {}

    // Send request to other client
  };

  return (
    <>
      <div>
        <Panel
          classes={"relative offOverflow"}
          component={<UsersFound onAddFriend={onAddFriend} />}
          id="friend-panel"
          form={
            <Form
              form={
                <FriendsForm
                  formData={formData}
                  onChange={onFormChange}
                  onSubmit={onSubmit}
                />
              }
              svg={<IoPeopleCircleSharp size={50} />}
              className="friend-form"
              message="Add Friends"
            />
          }
        />
      </div>
    </>
  );
};

export default FriendAdder;
