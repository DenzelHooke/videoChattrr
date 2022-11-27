import { useEffect } from "react";
import { useSelector } from "react-redux";
import Form from "../components/Form";
import { BsFillPersonPlusFill } from "react-icons/bs";
import RegisterForm from "../components/RegisterForm";
import { useRouter } from "next/router";

export default function Register() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <div className="main center">
      {
        <Form
          message="Register Now"
          form={<RegisterForm />}
          svg={<BsFillPersonPlusFill size={55} />}
        />
      }
    </div>
  );
}
