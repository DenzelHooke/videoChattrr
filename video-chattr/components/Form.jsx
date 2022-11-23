import React from "react";

const Form = ({ form, svg, message, className }) => {
  return (
    <div className={`${className} form__container`}>
      <div className="heading">
        {svg}
        <h2>{message}</h2>
      </div>
      {form}
    </div>
  );
};

export default Form;
