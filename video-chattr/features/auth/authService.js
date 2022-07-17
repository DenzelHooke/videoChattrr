import axios from "axios";

const API_URL = "http://localhost:8080/api";

const register = async (userData) => {
  const res = await axios.post(API_URL + "/users", userData);

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
    document.cookie = `user=${JSON.stringify(res.data)}; expires=${new Date(
      2023,
      0,
      1
    ).toUTCString()}`;
  }

  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(API_URL + "/users/login", userData);
  console.log(res.data);
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
    document.cookie = `user=${JSON.stringify(res.data)}; expires=${new Date(
      2023,
      0,
      1
    ).toUTCString()}`;
  }

  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
  document.cookie = `user=; expires=${new Date().toUTCString()}`;
};

const getRTC = async (userData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { token } = user;
  console.log("TOKEN: ", token);
  const config = {
    headers: {
      authorization: `Bearer: ${token}`,
    },
  };

  const res = await axios.post(API_URL + "/auth/rtcToken", userData, config);

  if (res.data) {
    localStorage.setItem("rtcToken", res.data.rtcToken);
    localStorage.setItem("uid", res.data.uid);
  }
  return res;
};

const authService = {
  register,
  login,
  logout,
  getRTC,
};

export default authService;
