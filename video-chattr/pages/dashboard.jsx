import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";

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

  useEffect(() => {
    initAgora();
  })

  return <div>Hello, {user.username}</div>;
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
