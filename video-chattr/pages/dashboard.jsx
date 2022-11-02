import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
// import RtcUser from "./video/videoFuncs";
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
  setError,
  resetRoomState,
} from "../features/room/roomSlice";
import {
  createRoomCookie,
  getRunningRoom,
  joinUserToRoom,
} from "../helpers/RoomsFuncs";
import roomService from "../features/room/roomService";
import LoadingCircle from "../components/LoadingCircle";
import FriendAdder from "../components/FriendAdder";

// The Rooms componenet requires the window object which isn't present  with SSR.
//This loads the component once ssr is done which means this comp isn't loaded in the page source.
const Rooms = dynamic(async () => await import("../components/Rooms"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

const Sidebar = dynamic(async () => await import("../components/Sidebar"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

function dashboard({ user }) {
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const { rtcToken, push } = useSelector((state) => state.auth);
  const { rooms, roomName, roomID, isSuccess, mode, exists, isError, message } =
    useSelector((state) => state.room);

  useEffect(() => {
    // Once setPush as been set to "room" and a roomName has been set,
    // Create cookie and push client to room page.
    if (push === "room" && roomName) {
      createRoomCookie(mode, rtcToken);
      router.push({
        pathname: "/room",
      });
    }
  }, [push, roomName]);

  useEffect(() => {
    console.log("USER: ", user);
    if (!isServer) {
      // console.log(authState.user.token);
      if (!user) {
        toast.notify("Must be logged in to view this page.", {
          title: "Error",
          type: "error",
        });
        router.push("/");
        return;
      }
    }

    return () => {
      dispatch(resetPush("room"));
    };
  }, []);

  useEffect(() => {
    if (message && isError) {
      console.error(message);

      toast.notify(message, {
        title: "An error has occured",
        type: "error",
        duration: 5,
      });
      dispatch(removeToken());
      dispatch(resetRoomState());
      // dispatch(resetPush());
    }
  }, [message, isError]);

  const onClick = async ({ userInput, buttonMode }) => {
    dispatch(setMode(buttonMode));
    console.log(buttonMode);
    if (buttonMode === "create") {
      console.log("%c Creating room...", "color: #4ce353");

      try {
        dispatch(createRoom({ userInput, user }))
          .unwrap()
          .then((state) => dispatch(genRTC({ roomID: state.roomID })));
      } catch (error) {
        //TODO catch common errors
        console.error(error);
      }
    } else if (buttonMode === "join") {
      try {
        await joinUserToRoom({ roomService, userInput, toast, dispatch, user });

        // Connect user to other room
      } catch (error) {
        if (`${error}` === "AxiosError: Network Error") {
          dispatch(setError({ message: "Failed to connect to server." }));
        }
        // dispatch(setError({ message: `${error}` }));
        return;
      }
    }
  };

  return (
    <>
      <div className="growContainer grow">
        <div className={`${styles.mainWrapper}`}>
          <div id="sidebar">
            <Sidebar
              dispatch={dispatch}
              roomService={roomService}
              toast={toast}
            />
          </div>
          <div id={styles.mainContent} className="dashboard-outter-container">
            <div className="dashboard-inner-container">
              <div className="greeting">
                <h2 className="center-text focus-text">{`Welcome home, ${user.username}`}</h2>
              </div>
              <FriendAdder />
              {<Rooms onClick={onClick} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, req }) => {
      // console.log(auth);
      // console.log(req.cookies);
      let { user } = req.cookies;
      try {
        user = JSON.parse(user);
        console.log(user);
      } catch (error) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return {
        props: { user },
      };
    }
);

// if (!user) {
//   return {
//     redirect: {
//       destination: "/",
//       permanent: false,
//     },
//   };
// }

// return {
//   props: { user },
// };

export default dashboard;
