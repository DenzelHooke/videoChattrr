import { useState, useEffect } from "react";

const FriendsForm = ({ onSubmit, onChange, state, formData }) => {
  const { username, message, isErorr } = formData;

  return (
    <form action="" onSubmit={onSubmit} className="form-control">
      <div className="flex" id="friend-form-inner">
        <div className="input-wrap grow">
          <label className="blockElement text-left space-text focus-text">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="form-control input"
            id="username"
            onChange={onChange}
            value={username}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="successBg block-btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default FriendsForm;
