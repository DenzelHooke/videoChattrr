import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
import Rooms from "../componenets/Rooms";

function dashboard({ user }) {
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      toast.notify("Must be logged in to view this page.", {
        title: "Error",
        type: "error",
      });
      router.push("/");
      return;
    }

    console.log("hello");
    toast.notify(`Hello, ${user.username}`);
  }, []);

  return (
    <>
      <div className="growContainer grow">
        <div className={`${styles.mainWrapper}`}>
          <div id={styles.sidebar}>
            <ul>
              <li>Room 1</li>
              <li>Room 2</li>
              <li>Room 3</li>
            </ul>
          </div>
          <div id={styles.mainContent}>
            <Rooms />
          </div>
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
        props: { user: user },
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
