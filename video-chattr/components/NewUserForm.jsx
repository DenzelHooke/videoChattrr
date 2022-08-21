import { useState } from "react";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const NewUserForm = ({ onSubmit, onChange, formData }) => {
  const [showPassState, setShowPassState] = useState("hide");
  const { username, password1, password2 } = formData;

  const onClick = (e) => {
    const passField = document.querySelector("#password1");
    if (showPassState === "hide") {
      setShowPassState("show");
      passField.type = "text";
    } else {
      setShowPassState("hide");
      passField.type = "password";
    }
  };

  const showPass = {
    show: <FaEye onClick={onClick} size={35} />,
    hide: <FaEyeSlash onClick={onClick} size={35} />,
  };

  return (
    <form onSubmit={onSubmit} className="form-control">
      <div className="input__wrapper">
        <input
          className="form-input"
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={onChange}
        />
      </div>
      <div className="input__wrapper">
        <input
          className="form-input"
          id="password1"
          type="password"
          name="password1"
          placeholder="Password"
          value={password1}
          onChange={onChange}
        />
        {showPass[showPassState]}
      </div>
      <div className="input__wrapper">
        <input
          className="form-input"
          id="password2"
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={password2}
          onChange={onChange}
        />
      </div>
      <button type="submit" className="button btn_blue">
        Create Account
      </button>
    </form>
  );
};

export default NewUserForm;
