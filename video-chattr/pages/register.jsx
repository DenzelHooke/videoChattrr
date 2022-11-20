import Form from "../components/Form";
import { BsFillPersonPlusFill } from "react-icons/bs";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
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
