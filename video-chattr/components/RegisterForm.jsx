import { useEffect, useState } from "react";
// import register from "../controllers/user/register";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import NewUserForm from "./NewUserForm";

const RegisterForm = () => {
  const [valid, setValid] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    const inputs = document.querySelectorAll("input.input");
  }, [valid]);

  const { username, password1, password2 } = formData;

  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    if ((username.length && password1.length && password2.length) < 1) {
      return;
    }

    if (!valid) return;
    // await register({ username, password: password2 });
    dispatch(register({ username: username, password: password2 }));
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (password1 === password2 && password2.length >= 4) {
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
