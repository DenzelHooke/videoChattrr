import { useEffect } from "react";
import LoginForm from "../componenets/LoginForm";
import Form from "../componenets/Form";
import { AiOutlineLogin } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../features/auth/authSlice";
import { useRouter } from "next/router";

export default function () {
  const Router = useRouter();
  const dispatch = useDispatch();

  const { isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      Router.push("/dashboard");
    }

    dispatch(reset());
  }, [isSuccess]);

  return (
    <div className="main center">
      <Form
        form={<LoginForm />}
        message="Welcome Back!"
        svg={<AiOutlineLogin size={55} />}
      />
    </div>
  );
}
