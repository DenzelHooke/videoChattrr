import React from "react";
import styles from "../styles/Index.module.scss";

const Form = ({ form, svg, message }) => {
  return (
    <div className="card form__container">
      <div className="heading">
        {svg}
        <h2>{message}</h2>
      </div>
      {form}
    </div>
  );
};

export default Form;
