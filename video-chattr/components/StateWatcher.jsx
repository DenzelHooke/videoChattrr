import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { resetError, resetSuccess } from "../features/utils/utilsSlice";
import { useRouter } from "next/router";

const StateWatcher = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isError, isSuccess, message, push } = useSelector(
    (state) => state.utils
  );

  const position = "top-right";
  const autoClose = 5000;
  const hideProgressBar = true;
  const closeOnClick = true;
  const pauseOnHover = true;
  const draggable = true;
  const progress = undefined;
  const theme = "light";

  useEffect(() => {
    if (message && (isError || isSuccess)) {
      console.log(message);
      // console.error(message, isError, push);\

      if (isError) {
        toast.error(message, {
          position: position,
          autoClose: autoClose,
          hideProgressBar: hideProgressBar,
          closeOnClick: closeOnClick,
          pauseOnHover: pauseOnHover,
          draggable: draggable,
          progress: progress,
          theme: theme,
        });
        dispatch(resetError());
      } else if (isSuccess) {
        toast.success(message, {
          position: position,
          autoClose: autoClose,
          hideProgressBar: hideProgressBar,
          closeOnClick: closeOnClick,
          pauseOnHover: pauseOnHover,
          draggable: draggable,
          progress: progress,
          theme: theme,
        });
        dispatch(resetSuccess());
      }

      if (push) {
        router.push(push);
      }
      // Reset error state.
    }
  }, [message, isError, isSuccess]);
  return <div></div>;
};

export default StateWatcher;
