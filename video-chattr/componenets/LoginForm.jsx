import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-nextjs-toast";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isLoading, isError, success } = useSelector(
    (state) => state.auth
  );

  const [showPassState, setShowPassState] = useState("hide");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const onClick = (e) => {
    const passField = document.querySelector("#password");
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

  const { username, password } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();

    // if ((username.length && password.length) < 1) {
    //   return;
    // }

    if (!username || !password) {
      toast.notify("Please fill out all fields", {
        type: "error",
        title: "Uh oh!",
      });
      return;
    }

    dispatch(login(formData));
  };

  useEffect(() => {
    if (success) {
      router.push("/dashboard");
    }
    dispatch(reset());
  }, [success, isError]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="form__wrapper">
      <form onSubmit={onSubmit} className="form-control">
        <div className="input__wrapper">
          <input
            className="form-input"
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
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          {showPass[showPassState]}
        </div>
        <button type="submit" className="button btn_blue">
          Log into your Account
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
