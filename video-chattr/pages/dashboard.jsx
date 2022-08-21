import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
import DisplayRooms from "../components/DisplayRooms";
// import RtcUser from "./video/videoFuncs";

const Rooms = dynamic(async () => await import("../components/Rooms"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

function dashboard({ user }) {
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);
  const router = useRouter();
  const { rooms } = useSelector((state) => state.room);
  console.log(rooms);

  useEffect(() => {
    if (!user) {
      toast.notify("Must be logged in to view this page.", {
        title: "Error",
        type: "error",
      });
      router.push("/");
      return;
    }
    toast.notify(`Hello, ${user.username}`);
  }, []);

  return (
    <>
      <div className="growContainer grow">
        <div className={`${styles.mainWrapper}`}>
          <div id={styles.sidebar}>
            <DisplayRooms rooms={rooms} />
          </div>
          <div id={styles.mainContent}>{<Rooms />}</div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, req }) => {
      const { auth } = store.getState();
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
