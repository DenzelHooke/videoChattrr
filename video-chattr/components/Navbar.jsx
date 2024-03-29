import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isError, message, isSuccess } = useSelector(
    (state) => state.auth
  );

  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
    if (isError || isSuccess) {
      dispatch(reset());
    }
  }, [user]);

  const onLogout = () => {
    dispatch(logout());
    location.reload();
  };

  // const onClick = (e) => {
  //   if (e.target.id === "logout") {
  //     dispatch(removeToken());
  //     router.push("/dashboard");
  //   }
  // };

  // console.log(user);

  return (
    <nav id={styles.nav}>
      <div id={styles.inner__nav} className="constrain">
        <Link href="/">
          <a className={styles.logo}>
            <span>Video</span>
            <span>Chattr</span>
          </a>
        </Link>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {signedIn ? (
            <>
              <li>
                <Link href="/">
                  <a onClick={onLogout}>Logout</a>
                </Link>
              </li>
              <li className="button" id={styles.dashboard}>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <a>Register</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

// export async function getServerSideProps() {
//   await store.dispatch()
// }

export default Navbar;
