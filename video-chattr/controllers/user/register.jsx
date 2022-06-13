import axios from "axios";

const register = async (data) => {
  const { username, password } = data;

  if (!data) {
    throw new Error("register - data is required");
  }
  try {
    await axios.post("http://localhost:8080/api/users/register/", {
      username: username,
      password: password,
    });
  } catch (error) {
    console.log(error);
  }
};

export default register;
