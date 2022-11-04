import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import {
  genRTC,
  reset,
  removeToken,
  resetPush,
  setPush,
} from "../features/auth/authSlice";
import {
  createRoom,
  setRoomName,
  setRoomID,
  setMode,
  resetRoomState,
} from "../features/room/roomSlice";

import { resetError } from "../features/utils/utilsSlice";
import { useRouter } from "next/router";

const ErrorWatcher = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isError, message, push } = useSelector((state) => state.utils);
  // 5 seconds before err dissapears
  const errorDuration = 5;
  useEffect(() => {
    if (message && isError) {
      console.error(message);
      // console.error(message, isError, push);
      toast.notify(message, {
        title: "An error has occured",
        type: "error",
        duration: errorDuration,
      });

      if (push) {
        router.push(push);
      }
      // Reset error state.
      dispatch(resetError());
    }
  }, [message, isError]);
  return <div></div>;
};

export default ErrorWatcher;
