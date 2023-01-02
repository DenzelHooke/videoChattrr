import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL + "/users"
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL + "/users";

const RAW_API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL;

const register = async (userData) => {
  const res = await axios.post(API_URL, userData);

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
    document.cookie = `user=${JSON.stringify(res.data)}; expires=${new Date(
      9999,
      0,
      1
    ).toUTCString()}`;
  }

  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(API_URL + "/login", userData);
  console.log(res.data);
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
    document.cookie = `user=${JSON.stringify(res.data)}; expires=${new Date(
      9999,
      0,
      1
    ).toUTCString()}`;
    return res.data;
  }
};

const logout = () => {
  localStorage.removeItem("user");
  document.cookie = `user=; expires=${new Date().toUTCString()}`;
};

const genRTC = async (userData) => {
  //Calls backend with userData to generate a RTC token.
  const user = JSON.parse(localStorage.getItem("user"));
  const { token } = user;
  console.log(user);
  const config = {
    headers: {
      authorization: `Bearer: ${token}`,
    },
  };

  const res = await axios.post(
    RAW_API_URL + "/auth/rtcToken",
    userData,
    config
  );

  if (res.data) {
    localStorage.setItem("uid", res.data.uid);
  }
  return res;
};

const authService = {
  register,
  login,
  logout,
  genRTC,
};

export default authService;
