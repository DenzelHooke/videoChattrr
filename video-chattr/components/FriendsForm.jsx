import { useState, useEffect } from "react";

const FriendsForm = ({ onSumbit, state }) => {
  const [formData, setFormData] = useState({
    username: "",
    message: "",
    isError: false,
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
        <div className="input-wrap grow">
          <label className="blockElement text-left">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="form-control input"
            id="username"
            onChange={onChange}
            value={username}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="successBg block-btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default FriendsForm;
