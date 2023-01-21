import { useEffect, useState } from "react";
// import register from "../controllers/user/register";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import NewUserForm from "./NewUserForm";
import { setError } from "../features/utils/utilsSlice";
import { setSuccess } from "../features/utils/utilsSlice";

const RegisterForm = () => {
  const { isError, message, isSuccess } = useSelector((state) => state.auth);
  const passLength = 4;
  const [valid, setValid] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    console.log(message);
    if (isError) {
      dispatch(setError({ message: message }));
    }
  }, [isError, message]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setSuccess({
          message: "An account has been succesfully created!",
          push: "/dashboard",
        })
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    const inputs = document.querySelectorAll("input.input");
  }, [valid]);

  const { username, password1, password2 } = formData;

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    if (username.length < 1) {
      dispatch(setError({ message: "Please enter a username" }));
      return;
    }

    if (password1 !== password2) {
      dispatch(setError({ message: "Passwords do not match" }));
      return;
    }

    if (password1.length < passLength) {
      dispatch(
        setError({
          message: "Please enter a password longer than 3 characters",
        })
      );
      return;
    }

    if (password2.length < passLength) {
      dispatch(
        setError({
          message: "Please confirm password",
        })
      );
      return;
    }

    // if ((username.length && password1.length && password2.length) < 1) {
    //   dispatch(setError({ message: "szzz" }));
    //   return;
    // }

    if (!valid) return;
    // await register({ username, password: password2 });
    dispatch(register({ username: username, password: password2 }));
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (password1 === password2 && password2.length >= passLength) {
      setValid(true);
    }
  };

  return (
    <div className="form__wrapper signup__form">
      <NewUserForm
        onSubmit={onSubmit}
        onChange={onChange}
        formData={formData}
      />
    </div>
  );
};

export default RegisterForm;
