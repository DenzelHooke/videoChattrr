import { useEffect, useState } from "react";
import Form from "../components/Form";
import { BsFillPersonPlusFill } from "react-icons/bs";
import RegisterForm from "../components/RegisterForm";
import { toast } from "react-nextjs-toast";

function Register() {
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

export default Register;
