import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../features/auth/authSlice";
import Head from "next/head";
import Image from "next/image";
import Form from "../componenets/Form";
import SignupForm from "../componenets/SignupForm";
import styles from "../styles/Index.module.scss";
import { MdHome } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { BsShieldLockFill } from "react-icons/bs";
import { MdDraw } from "react-icons/md";
import { toast } from "react-nextjs-toast";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      toast.notify(`Welcome, ${user.username}`, {
        type: "success",
      });
    }
    dispatch(reset());
  }, [user]);

  const item_svg_size = 40;

  return (
    <div className={`${styles.index__wrapper} ${styles.override}`}>
      <div id={styles.intro__wrapper}>
        <div className="container">
          <div className={styles.cta}>
            <div className={styles.intro__message}>
              <h1>
                Always stay <span>connected</span>
                with family and friends.
              </h1>
              <p>
                VideoChattr makes it easy to stay connected with crystal clear
                video calling and instant messaging
              </p>
            </div>
            <Form
              form={<SignupForm />}
              svg={<MdHome size={55} />}
              message="Get Started"
            />
          </div>
        </div>
        <div className={styles.background__effect}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#0099ff"
              fillOpacity="1"
              d="M0,128L21.8,112C43.6,96,87,64,131,74.7C174.5,85,218,139,262,181.3C305.5,224,349,256,393,224C436.4,192,480,96,524,74.7C567.3,53,611,107,655,112C698.2,117,742,75,785,90.7C829.1,107,873,181,916,202.7C960,224,1004,192,1047,181.3C1090.9,171,1135,181,1178,181.3C1221.8,181,1265,171,1309,176C1352.7,181,1396,203,1418,213.3L1440,224L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      <div className="middle">
        <div className={`${styles.info} container`}>
          <ul className={styles.info_ul}>
            <li className={`${styles.item} card`}>
              <div className={styles.item}>
                <div className={styles.item__heading}>
                  {<AiFillThunderbolt size={item_svg_size} />}
                  <p>Lighting Fast Speed</p>
                </div>
                <p className={styles.item__paragraph}>
                  Your calls are delivered over the fastest network pipelines on
                  the market.
                </p>
              </div>
            </li>
            <li className={`${styles.item} card`}>
              <div className={styles.item}>
                <div className={styles.item__heading}>
                  {<BsShieldLockFill size={item_svg_size} />}
                  <p>Military Grade Encryption</p>
                </div>
                <p className={styles.item__paragraph}>
                  Security is our number one priority. Calls are only delivered
                  directly Peer to Peer without any 3rd party involvement.
                </p>
              </div>
            </li>
            <li className={`${styles.item} card`}>
              <div className={styles.item}>
                <div className={styles.item__heading}>
                  {<MdDraw size={item_svg_size} />}
                  <p>Intuitive Design</p>
                </div>
                <p className={styles.item__paragraph}>
                  Our engineers have designed VideoChattr to be incredibly
                  intuitive and easy to use.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
