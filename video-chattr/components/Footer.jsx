import React from "react";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
  return (
    <footer id={styles.footer}>
      <p>Made with <span className={styles.heart}>&#10084;</span> by <span>Denzel Hooke</span></p>
    </footer>
  );
};

export default Footer;
