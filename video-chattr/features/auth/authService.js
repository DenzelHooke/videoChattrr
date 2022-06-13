import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const register = async (userData) => {
  const res = await axios.post(API_URL, userData);

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `user=${JSON.stringify(userData)}; expires=${new Date(
      2023,
      0,
      1
    ).toUTCString()}`;
  }

  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(API_URL + "/login", userData);

  if (res.data) {
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `user=${JSON.stringify(userData)}; expires=${new Date(
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

const authService = {
  register,
  login,
  logout,
};

export default authService;
