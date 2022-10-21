import { useState, useEffect } from "react";

const FriendsForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    message: "",
    isError: false,
    friendsFound: [],
  });

  const { username, message, isErorr } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Friend Form Submitted!");
  };

  const onChange = (e) => {
    setFormData((...prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <form action="" onSubmit={onSubmit} className="form-control">
      <div className="flex" id="friend-form-inner">
        <input
          type="text"
          placeholder="Enter username"
          className="form-control input"
          id="username"
          onChange={onChange}
          value={username}
          autoComplete="new-password"
        />
        <button type="submit" className="successBg block-btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default FriendsForm;
