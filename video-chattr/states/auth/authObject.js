
const runningOnServer = typeof window === "undefined";

let user;

if (!runningOnServer) {
  user = JSON.parse(localStorage.getItem("user"));
}

const authObject = {
  user: user ? user : null,
  isError: null,
  isSuccess: null,
  isLoading: null,
  message: "",
};

export default authObject;